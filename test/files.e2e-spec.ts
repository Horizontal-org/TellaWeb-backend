import * as JSZip from 'jszip';
import * as sharp from 'sharp';

import {
  bearer,
  createTestApp,
  loginMobile,
  loginWeb,
  Session,
  TestApp,
  USERS,
} from './setup/app';
import { binaryParser, png, wav } from './setup/fixtures';

describe('files', () => {
  let t: TestApp;
  let admin: Session;
  let editor: Session;
  let reporter: Session;
  let adminMobile: Session;
  let reportId: string;

  const audio = wav(4000);
  let image: Buffer;
  let audioFile: any;
  let imageFile: any;

  const uploadChunk = (
    session: Session,
    fileName: string,
    body: Buffer,
    start: number,
    total: number,
    headers: Record<string, string> = {},
  ) =>
    t
      .http()
      .put(`/file/v2/${reportId}/${fileName}`)
      .set(bearer(session))
      .set('Content-Type', 'application/octet-stream')
      .set(
        'Content-Range',
        `bytes ${start}-${start + body.length - 1}/${total}`,
      )
      .set(headers)
      .send(body);

  beforeAll(async () => {
    t = await createTestApp();
    admin = await loginWeb(t, USERS.admin);
    editor = await loginWeb(t, USERS.editor);
    reporter = await loginMobile(t, USERS.reporter);
    adminMobile = await loginMobile(t, USERS.admin);
    image = await png();

    const project = (
      await t
        .http()
        .post('/project')
        .set(bearer(admin))
        .send({
          name: 'E2E files project',
          users: [t.users.reporter.id, t.users.editor.id],
        })
        .expect(201)
    ).body;
    reportId = (
      await t
        .http()
        .post(`/project/${project.id}`)
        .set(bearer(reporter))
        .send({ title: 'E2E files report' })
        .expect(201)
    ).body.id;
  });

  afterAll(async () => {
    await t.close();
  });

  describe('resumable upload (v2)', () => {
    it('a first chunk answers 206 with the received range', async () => {
      const res = await uploadChunk(
        reporter,
        'audio.wav',
        audio.subarray(0, 1000),
        0,
        audio.length,
      ).expect(206);

      expect(res.body).toEqual({ success: true, error: null, complete: false });
      expect(res.headers.range).toBe('bytes=0-999');
    });

    it('HEAD reports the size received so far', async () => {
      const res = await t
        .http()
        .head(`/file/${reportId}/audio.wav`)
        .set(bearer(reporter))
        .expect(200);

      expect(res.headers.size).toBe('1000');
      expect(res.headers.range).toBe('bytes=0-999');
    });

    it('a chunk that starts past the received bytes is rejected', async () => {
      await uploadChunk(
        reporter,
        'audio.wav',
        audio.subarray(2000, 2100),
        2000,
        audio.length,
      ).expect(400);
    });

    it('the last chunk completes and closes the file', async () => {
      const res = await uploadChunk(
        reporter,
        'audio.wav',
        audio.subarray(1000),
        1000,
        audio.length,
        {
          'X-File-Info': JSON.stringify({ duration: 0.25 }),
        },
      ).expect(200);

      audioFile = res.body;
      expect(audioFile).toMatchObject({
        id: expect.any(String),
        fileName: 'audio.wav',
        bucket: reportId,
      });
    });

    it('a whole file in one request', async () => {
      const res = await uploadChunk(
        reporter,
        'image.png',
        image,
        0,
        image.length,
      ).expect(200);
      imageFile = res.body;
      expect(imageFile).toMatchObject({
        fileName: 'image.png',
        bucket: reportId,
      });
    });

    it('the report lists both files with their detected types', async () => {
      const res = await t
        .http()
        .get(`/report/${reportId}`)
        .set(bearer(editor))
        .expect(200);

      const files = {};
      res.body.files.forEach((f) => (files[f.fileName] = f));
      expect(files['audio.wav']).toMatchObject({
        id: audioFile.id,
        type: 'AUDIO',
        fileInfo: { duration: 0.25 },
      });
      expect(files['image.png']).toMatchObject({
        id: imageFile.id,
        type: 'IMAGE',
      });
    });

    it('requires Content-Range', async () => {
      await t
        .http()
        .put(`/file/v2/${reportId}/nocontentrange.bin`)
        .set(bearer(reporter))
        .set('Content-Type', 'application/octet-stream')
        .send(Buffer.from('abc'))
        .expect(411);
    });

    it('rejects a malformed Content-Range or one that does not match the body', async () => {
      await t
        .http()
        .put(`/file/v2/${reportId}/bad.bin`)
        .set(bearer(reporter))
        .set('Content-Type', 'application/octet-stream')
        .set('Content-Range', 'bytes 0-2')
        .send(Buffer.from('abc'))
        .expect(400);
      await t
        .http()
        .put(`/file/v2/${reportId}/bad.bin`)
        .set(bearer(reporter))
        .set('Content-Type', 'application/octet-stream')
        .set('Content-Range', 'bytes 0-9/10')
        .send(Buffer.from('abc'))
        .expect(400);
    });

    it('rejects bad JSON in X-File-Info', async () => {
      await uploadChunk(reporter, 'badinfo.wav', audio, 0, audio.length, {
        'X-File-Info': '{nope',
      }).expect(400);
    });

    it('only the author of the report can upload to it', async () => {
      await uploadChunk(
        adminMobile,
        'intruder.wav',
        audio,
        0,
        audio.length,
      ).expect(403);
    });
  });

  describe('deprecated upload (v1) and close', () => {
    it('uploads, then closes with a separate request', async () => {
      const upload = await t
        .http()
        .put(`/file/${reportId}/legacy.wav`)
        .set(bearer(reporter))
        .set('Content-Type', 'application/octet-stream')
        .send(audio)
        .expect(200);
      expect(upload.headers.deprecation).toBe('true');
      expect(upload.body).toMatchObject({ fileName: 'legacy.wav' });

      const close = await t
        .http()
        .post(`/file/${reportId}/legacy.wav`)
        .set(bearer(reporter))
        .send({})
        .expect(201);
      expect(close.body).toEqual({ success: true });
    });
  });

  describe('downloads', () => {
    it('streams a byte range of an audio file', async () => {
      const res = await t
        .http()
        .get(`/file/asset/${reportId}/${audioFile.id}`)
        .set(bearer(editor))
        .set('Range', 'bytes=100-199')
        .buffer(true)
        .parse(binaryParser)
        .expect(206);

      expect(res.headers['content-range']).toBe(
        `bytes 100-199/${audio.length}`,
      );
      expect(res.headers['content-length']).toBe('100');
      expect(res.headers['accept-ranges']).toBe('bytes');
      expect(res.headers['content-type']).toMatch(/^audio\//);
      expect(Buffer.compare(res.body, audio.subarray(100, 200))).toBe(0);
    });

    it('streams the whole audio file for an open-ended range, as browsers ask for media', async () => {
      const res = await t
        .http()
        .get(`/file/asset/${reportId}/${audioFile.id}`)
        .set('Cookie', editor.cookie)
        .set('Range', 'bytes=0-')
        .buffer(true)
        .parse(binaryParser)
        .expect(206);

      expect(res.headers['content-range']).toBe(
        `bytes 0-${audio.length - 1}/${audio.length}`,
      );
      expect(Buffer.compare(res.body, audio)).toBe(0);
    });

    // Known bug: without a Range header the end of the range is the file size
    // instead of size - 1, so Content-Length is one byte too long and the
    // response never completes.
    it.failing(
      'streams the whole audio file without a Range header',
      async () => {
        const res = await t
          .http()
          .get(`/file/asset/${reportId}/${audioFile.id}`)
          .set(bearer(editor))
          .buffer(true)
          .parse(binaryParser)
          .expect(206);

        expect(Buffer.compare(res.body, audio)).toBe(0);
      },
    );

    it('returns the JPEG preview (max 800px) for an image', async () => {
      const res = await t
        .http()
        .get(`/file/asset/${reportId}/${imageFile.id}`)
        .set(bearer(editor))
        .buffer(true)
        .parse(binaryParser)
        .expect(206);

      const meta = await sharp(res.body).metadata();
      expect(meta.format).toBe('jpeg');
      expect(meta.width).toBe(800);
    });

    it('returns a resized PNG thumbnail', async () => {
      const res = await t
        .http()
        .get(`/file/asset/${reportId}/${imageFile.id}/100`)
        .set(bearer(editor))
        .buffer(true)
        .parse(binaryParser)
        .expect(200);

      expect(res.headers['content-type']).toBe('image/png');
      const meta = await sharp(res.body).metadata();
      expect(meta.width).toBeLessThan(1200);
    });

    it('reporters cannot download files', async () => {
      await t
        .http()
        .get(`/file/asset/${reportId}/${audioFile.id}`)
        .set(bearer(reporter))
        .expect(403);
    });

    it('zips the whole report', async () => {
      const res = await t
        .http()
        .get(`/file/report/${reportId}`)
        .set(bearer(editor))
        .buffer(true)
        .parse(binaryParser)
        .expect(200);

      expect(res.headers['content-type']).toBe('application/zip');
      const zip = await JSZip.loadAsync(res.body);
      const names = Object.keys(zip.files);
      expect(names).toEqual(
        expect.arrayContaining(['audio.wav', 'image.png', 'legacy.wav']),
      );
      const content = await zip.file('audio.wav').async('nodebuffer');
      expect(Buffer.compare(content, audio)).toBe(0);
    });

    // despite the route param name and the zip Content-Type, this takes the
    // file name and sends the file itself (that's how the web app calls it)
    it('downloads a single file by name', async () => {
      const res = await t
        .http()
        .get(`/file/download/${reportId}/image.png`)
        .set(bearer(editor))
        .buffer(true)
        .parse(binaryParser)
        .expect(200);

      expect(res.headers['content-type']).toBe('application/zip');
      expect(Buffer.compare(res.body, image)).toBe(0);
    });

    // Known bug: an unknown file name crashes the handler (null.pipe).
    it.failing('an unknown file name is a 404', async () => {
      await t
        .http()
        .get(`/file/download/${reportId}/missing.png`)
        .set(bearer(editor))
        .expect(404);
    });
  });

  describe('delete', () => {
    it('editors delete a file', async () => {
      const res = await t
        .http()
        .delete(`/file/${reportId}/${audioFile.id}`)
        .set(bearer(editor))
        .expect(200);
      expect(res.body).toEqual({ deleted: true });

      const report = await t
        .http()
        .get(`/report/${reportId}`)
        .set(bearer(editor))
        .expect(200);
      expect(report.body.files.map((f) => f.id)).not.toContain(audioFile.id);
    });

    it('reporters cannot delete files', async () => {
      await t
        .http()
        .delete(`/file/${reportId}/${imageFile.id}`)
        .set(bearer(reporter))
        .expect(403);
    });
  });
});
