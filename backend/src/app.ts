import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import formRoutes from './routes/formRoutes';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

// Limitation de la taille JSON
app.use(express.json({ limit: '1mb' }));

app.use(cors());

// Protection anti-spam
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: "Trop de requêtes envoyées. Merci de réessayer plus tard."
});
app.use(limiter);

// Routes
app.use('/', formRoutes);


// toutes tes routes
app.use('/', formRoutes);

// middleware global d'erreur 
app.use(errorHandler);

