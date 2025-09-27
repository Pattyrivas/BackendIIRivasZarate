import dotenv from 'dotenv';
dotenv.config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const NODE_ENV    = process.env.NODE_ENV || 'development';
export const PORT        = process.env.PORT || 8080;
export const MONGO_URL   = required('MONGO_URL');
export const JWT_SECRET  = required('JWT_SECRET');  // <-- obligatorio
export const FRONT_URL   = process.env.FRONT_URL || `http://localhost:${PORT}`;

// Mail
export const MAIL_PROVIDER       = process.env.MAIL_PROVIDER || 'mailtrap';
export const MAIL_USER           = process.env.MAIL_USER || '';
export const MAIL_PASS           = process.env.MAIL_PASS || '';
export const MAIL_HOST           = process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io';
export const MAIL_PORT           = Number(process.env.MAIL_PORT || 587);
export const MAIL_USER_MAILTRAP  = process.env.MAIL_USER_MAILTRAP || '';
export const MAIL_PASS_MAILTRAP  = process.env.MAIL_PASS_MAILTRAP || '';
