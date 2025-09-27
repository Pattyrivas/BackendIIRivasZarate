import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import userModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils/password.js';
import { JWT_SECRET } from './env.js'; // ✅ usa config centralizada

const LocalStrategy = local.Strategy;
const JwtStrategy   = jwt.Strategy;
const ExtractJwt    = jwt.ExtractJwt;

// Extrae el JWT desde la cookie 'jwt'
const cookieExtractor = (req) =>
  (req && req.cookies ? req.cookies['jwt'] : null);

export const initPassport = () => {
  // ========== REGISTER ==========
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
          role: 'user',
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

  // ========== LOGIN ==========
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

  // ========== JWT ==========
  passport.use('jwt', new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: JWT_SECRET,     // ✅ desde env.js (sin fallback débil)
      ignoreExpiration: false
    },
    async (payload, done) => {
      try {
        // Retro-compatible: soporta tokens { id } o { user: { id / _id } }
        const userId =
          payload?.id ||
          payload?.user?.id ||
          payload?.user?._id;

        if (!userId) return done(null, false);

        // ✅ Siempre traer el usuario fresco desde la BD
        const user = await userModel
          .findById(userId)
          .select('-password');

        if (!user) return done(null, false);

      
        return done(null, user); // req.user = usuario actualizado
      } catch (err) {
        console.error('JWT exception:', err);
        return done(err, false);
      }
    }
  ));
};
