import { bearer, createTestApp, loginWeb, TestApp, USERS } from './setup/app';

// What the web app relies on from the HTTP layer itself: CORS and the
// Swagger docs at /api.
describe('http', () => {
  let t: TestApp;

  beforeAll(async () => {
    t = await createTestApp({ swagger: true });
  });

  afterAll(async () => {
    await t.close();
  });

  describe('CORS', () => {
    it('answers a preflight from the web app with credentials allowed', async () => {
      const res = await t
        .http()
        .options('/user')
        .set('Origin', 'https://web.e2e.test')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'authorization,range');

      expect(res.status).toBeLessThan(300);
      expect(res.headers['access-control-allow-origin']).toBe(
        'https://web.e2e.test',
      );
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });

    it('exposes the Range, Content-Range and size headers to the web app', async () => {
      const session = await loginWeb(t, USERS.admin);
      const res = await t
        .http()
        .get('/user')
        .set('Origin', 'https://app.e2e.test')
        .set(bearer(session))
        .expect(200);

      expect(res.headers['access-control-allow-origin']).toBe(
        'https://app.e2e.test',
      );
      expect(
        res.headers['access-control-expose-headers']
          .split(',')
          .map((h) => h.trim().toLowerCase())
          .sort(),
      ).toEqual(['content-range', 'range', 'size']);
    });

    it('does not allow other origins', async () => {
      const res = await t
        .http()
        .get('/user')
        .set('Origin', 'https://evil.e2e.test');
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('Swagger', () => {
    let doc: any;

    beforeAll(async () => {
      doc = (await t.http().get('/api-json').expect(200)).body;
    });

    it('serves the UI', async () => {
      const res = await t.http().get('/api/').expect(200);
      expect(res.text).toContain('swagger-ui');
    });

    it('documents the API with the JWT bearer scheme', () => {
      expect(doc.info).toMatchObject({ title: 'Tella Web', version: '1.0' });
      expect(doc.components.securitySchemes.jwt).toMatchObject({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      });
    });

    it('lists the routes', () => {
      for (const path of [
        '/login',
        '/login/web',
        '/auth/refresh',
        '/user/list',
        '/project/{projectId}',
        '/p/{projectSlug}',
        '/report',
        '/file/v2/{reportId}/{fileName}',
        '/file/asset/{reportId}/{fileId}',
        '/backup/download/{backupId}',
        '/resource',
        '/config',
        '/global-setting',
      ]) {
        expect(Object.keys(doc.paths)).toContain(path);
      }
    });

    // every route and method; a framework upgrade must not change this list
    it('has the same routes as before', () => {
      const routes: string[] = [];
      for (const [path, methods] of Object.entries(doc.paths)) {
        for (const method of Object.keys(methods)) {
          routes.push(`${method.toUpperCase()} ${path}`);
        }
      }
      routes.sort();
      expect(routes).toMatchSnapshot();
    });

    it('documents request bodies from the DTOs', () => {
      const body =
        doc.paths['/user'].post.requestBody.content['application/json'].schema;
      const ref = body.$ref.split('/').pop();
      expect(Object.keys(doc.components.schemas[ref].properties)).toEqual(
        expect.arrayContaining(['username', 'password', 'role']),
      );
    });

    it('documents the delete responses as booleans', () => {
      const response = doc.paths['/user/{userId}'].delete.responses['200'];
      expect(response.content['application/json'].schema.type).toBe('boolean');
    });
  });
});
