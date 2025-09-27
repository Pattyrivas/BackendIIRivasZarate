import nodemailer from 'nodemailer';

const provider = process.env.MAIL_PROVIDER ?? 'gmail';

let transporter;

if (provider === 'gmail') {
  // Gmail con App Password (necesita 2FA)
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
} else if (provider === 'mailtrap') {
  // Mailtrap para entornos de prueba
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT ?? 587),
    auth: {
      user: process.env.MAIL_USER_MAILTRAP,
      pass: process.env.MAIL_PASS_MAILTRAP
    }
  });
} else {
  throw new Error(`MAIL_PROVIDER desconocido: ${provider}`);
}

export const mailer = transporter;
