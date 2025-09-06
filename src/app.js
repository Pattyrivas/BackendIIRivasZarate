import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";

import { initPassport } from "./config/passport.config.js";

import usersRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

// Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

// MongoDB
mongoose.connect(MONGO_URL, { dbName: "ecommerce" })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(error => console.error("❌ Error connecting to MongoDB:", error.message));

// Passport
initPassport();
app.use(passport.initialize());

// Rutas
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
