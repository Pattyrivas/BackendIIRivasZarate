import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import { createHash, isValidPassword } from '../utils/password.js';
import { mailer } from '../config/mailer.js';
import {
  JWT_SECRET,
  FRONT_URL,
  MAIL_USER,
  MAIL_PROVIDER
} from '../config/env.js';

const usersRepo = new UserRepository();

export class AuthService {
  async sendResetPassword(email) {
    const normalized = String(email || '').trim().toLowerCase();
    const user = await usersRepo.findByEmail(normalized);

    // Por seguridad, respondemos igual aunque no exista; solo enviamos si existe
    if (!user) return;

    // Firmamos token de reset por 1 hora
    const token = jwt.sign(
      { id: user._id.toString(), purpose: 'reset' }, // acepta 'id' (ver resetPassword)
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const base = (FRONT_URL || `http://localhost:8080`).replace(/\/+$/, '');
    const link = `${base}/reset-password?token=${token}`;

    const fromAddress =
      (MAIL_USER && `Patty's Shop <${MAIL_USER}>`) ||
      `Patty's Shop <no-reply@${MAIL_PROVIDER === 'gmail' ? 'gmail.test' : 'mailtrap.test'}>`;

    // Si el envío falla, deja registro pero no filtra información al cliente
    try {
      await mailer.sendMail({
        from: fromAddress,
        to: user.email,
        subject: 'Restablecer contraseña',
        html: `
          <p>Solicitaste restablecer tu contraseña. Este enlace expira en 1 hora.</p>
          <p>
            <a href="${link}" style="padding:8px 12px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">
              Restablecer contraseña
            </a>
          </p>
          <p>Si no fuiste tú, ignora este correo.</p>
        `
      });
    } catch (err) {
      console.error('Mailer error (forgot-password):', err?.message || err);
    }
  }

  async resetPassword(token, newPassword) {
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
      if (payload?.purpose !== 'reset') {
        return { ok: false, error: 'Invalid token' };
      }
    } catch {
      return { ok: false, error: 'Invalid or expired token' };
    }

    // Acepta tokens antiguos con 'uid' o nuevos con 'id'
    const userId = payload.id || payload.uid;
    if (!userId) return { ok: false, error: 'Invalid token' };

    const user = await usersRepo.findById(userId);
    if (!user) return { ok: false, error: 'User not found' };

    // Bloquea reutilizar la misma contraseña
    if (isValidPassword(user, newPassword)) {
      return { ok: false, error: 'New password must be different' };
    }

    user.password = createHash(newPassword);
    await user.save();


    return { ok: true };
  }
}
