import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Erreur serveur :', err);

  res.status(500).json({
    error: "Erreur serveur inattendue. Veuillez réessayer plus tard."
  });
};
