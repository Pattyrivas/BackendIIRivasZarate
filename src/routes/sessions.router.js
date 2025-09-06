import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretJWT';
const COOKIE_NAME = 'jwt';

router.post('/register', (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) {
      console.error('register fatal:', err);
      return res.redirect('/register?error=' + encodeURIComponent('Error interno'));
    }
    if (!user) {
      const msg = info?.message || 'Datos inválidos';
      return res.redirect('/register?error=' + encodeURIComponent(msg));
    }
    
    return res.redirect('/login?registered=1');
  })(req, res, next);
});

// LOGIN: si falla, redirige a /login?error=1; si funciona, genera cookie JWT y va a /products
router.post('/login',
  passport.authenticate('login', { session: false, failureRedirect: '/login?error=1' }),
  (req, res) => {
    const u = req.user;
    const token = jwt.sign(
      {
        user: {
          id: u._id,
          email: u.email,
          role: u.role,
          first_name: u.first_name,
          last_name: u.last_name,
          age: u.age,
          cart: u.cart
        }
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: 3600_000,
      sameSite: 'lax'
    });

    return res.redirect('/products');
  }
);

// CURRENT: devuelve el usuario del JWT
router.get('/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => res.json({ status: 'success', user: req.user })
);

// LOGOUT: borra cookie y vuelve a login
router.get('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.redirect('/login');
});

export default router;
