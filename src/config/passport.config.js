import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import userModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/password.js';

const LocalStrategy = local.Strategy;
const JwtStrategy   = jwt.Strategy;
const ExtractJwt    = jwt.ExtractJwt;

const cookieExtractor = (req) => (req && req.cookies ? req.cookies['jwt'] : null);

export const initPassport = () => {
  // REGISTER
  passport.use('register', new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true, session: false },
    async (req, email, password, done) => {
      try {
        let { first_name, last_name, age } = req.body;

        if (!first_name || !last_name || !email || !password || !age) {
          return done(null, false, { message: 'Faltan campos' });
        }

        email = String(email).trim().toLowerCase();
        age = Number(age);

        const exists = await userModel.findOne({ email });
        if (exists) return done(null, false, { message: 'Email ya registrado' });

        const user = await userModel.create({
          first_name,
          last_name,
          email,
          age,
          password: createHash(password),
          role: 'user'
        });

        return done(null, user);
      } catch (err) {
        if (err?.code === 11000) {
          return done(null, false, { message: 'Email ya registrado' });
        }
        console.error('Register exception:', err);
        return done(err);
      }
    }
  ));

  // LOGIN
  passport.use('login', new LocalStrategy(
    { usernameField: 'email', session: false },
    async (email, password, done) => {
      try {
        email = String(email).trim().toLowerCase();
        const user = await userModel.findOne({ email });
        if (!user) return done(null, false, { message: 'Credenciales inválidas' });
        if (!isValidPassword(user, password)) return done(null, false, { message: 'Credenciales inválidas' });
        return done(null, user);
      } catch (err) {
        console.error('Login exception:', err);
        return done(err);
      }
    }
  ));

  // JWT
  passport.use('jwt', new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_SECRET || 'supersecretJWT',
      ignoreExpiration: false
    },
    async (payload, done) => {
      try {
        return done(null, payload.user);
      } catch (err) {
        return done(err, false);
      }
    }
  ));
};
