import { UserDTO } from '../dtos/user.dto.js';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const current = (req, res) => {
  if (!req.user) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
  return res.json({ status: 'success', user: new UserDTO(req.user) });
};

export const requestReset = async (req, res) => {
  await authService.sendResetPassword(req.body.email);
  return res.json({ status: 'success', message: 'If the email exists, a reset link was sent' });
};

export const doReset = async (req, res) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword(token, password);
  if (!result.ok) return res.status(400).json({ status: 'error', message: result.error });
  return res.json({ status: 'success', message: 'Password updated' });
};
