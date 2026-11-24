// Renders the real Handlebars templates through nodemailer, with a JSON
// transport instead of SMTP.
jest.mock('nodemailer', () => {
  const actual = jest.requireActual('nodemailer');
  return {
    ...actual,
    createTransport: () => actual.createTransport({ jsonTransport: true }),
  };
});

import { MailUtilService } from '../services/mail.util.service';

describe('MailUtilService', () => {
  const service = new MailUtilService();

  async function render(template: string, data: Record<string, string>) {
    const sendMail = jest.spyOn(service.transporter, 'sendMail');
    await service.send({
      to: 'someone@e2e.test',
      subject: 'Subject',
      template,
      data,
    });
    const info =
      await sendMail.mock.results[sendMail.mock.results.length - 1].value;
    return JSON.parse(info.message);
  }

  it('renders the blocked account email with the layout and partials', async () => {
    const mail = await render('blocked-account', {
      username: 'someone@e2e.test',
      location: 'Argentina',
      ip: '203.0.113.7',
      device: 'server-1',
      token: 'abc123token',
      url: 'https://admin.example.test',
    });

    expect(mail.to).toEqual([{ address: 'someone@e2e.test', name: '' }]);
    expect(mail.subject).toBe('Subject');
    for (const value of [
      'someone@e2e.test',
      'Argentina',
      '203.0.113.7',
      'server-1',
      'abc123token',
      'https://admin.example.test',
    ]) {
      expect(mail.html).toContain(value);
    }
    expect(mail.html).toMatch(/<html|<table|<body/i);
    expect(mail.html).not.toContain('{{');
  });

  it('renders the backup processed email', async () => {
    const mail = await render('backup-processed', {
      url: 'https://admin.example.test',
    });

    expect(mail.html).toContain('https://admin.example.test');
    expect(mail.html).not.toContain('{{');
  });

  it('rejects when a template is missing, so the queue retries', async () => {
    await expect(
      service.send({
        to: 'x@e2e.test',
        subject: 'S',
        template: 'missing',
        data: {},
      }),
    ).rejects.toThrow();
  });
});
