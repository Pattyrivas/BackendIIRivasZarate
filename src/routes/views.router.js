import { Router } from "express";
import passport from "passport";

const router = Router();

router.get('/register', (req, res) => {
  const { error } = req.query;
  res.render('register', { error });
});

router.get('/login', (req, res) => {
  const { registered, error } = req.query;
  res.render('login', { registered, error });
});


router.get('/products',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.render('products', { user: req.user });
  }
);

export default router;
