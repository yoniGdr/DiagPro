// Contrôleur du formulaire : gère l'enregistrement et la récupération des données côté serveur
// Utilise un fichier JSON local pour stocker les soumissions.

import { Request, Response, RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import { validateAndSanitizeContact } from '../utils/validator';

const API_SECRET_KEY = 'goweb2025'; // Clé secrète utilisée pour sécuriser l'accès à l'API de récupération des soumissions
// Remarque : en production, cette clé devrait être stockée dans un fichier .env sécurisé

export const testRoute: RequestHandler = (req, res) => {
  res.send('Hello World from Backend');
};
// Route de test simple pour vérifier que le backend fonctionne
export const saveForm: RequestHandler = (req, res) => {
  const { contact, answers } = req.body;

  if (!contact || !answers) { // Vérification que les données requises sont présentes
    void res.status(400).json({ error: "Formulaire incomplet." });
    return;
  }

  const sanitizedContact = validateAndSanitizeContact(contact); // Validation et nettoyage des données de contact
  if (!sanitizedContact.success) {
    void res.status(400).json({ error: sanitizedContact.error });
    return;
  }

  const filePath = path.join(__dirname, '../responses.json'); // Chemin du fichier JSON où seront stockées les réponses
  let existingData = [];

  if (fs.existsSync(filePath)) { // Lecture des anciennes soumissions si le fichier existe déjà
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    if (fileContent) {
      existingData = JSON.parse(fileContent);
    }
  }

  existingData.push({ // Ajout de la nouvelle soumission avec un timestamp
    timestamp: new Date().toISOString(),
    contact: sanitizedContact.cleanedContact,
    answers,
  });

  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8'); // Sauvegarde de toutes les soumissions dans le fichier JSON

  void res.status(200).json({ message: 'Données sauvegardées avec succès !' }); // Envoi d'une réponse de succès au client

};
// 📄 Route GET /submissions
// Retourne la liste de toutes les soumissions si la bonne clé API est fournie
export const getSubmissions: RequestHandler = (req, res) => {
  const apiKey = req.query.apiKey;

  /// Vérification de la validité de la clé API fournie dans la requête
  if (apiKey !== API_SECRET_KEY) {
    void res.status(403).json({ error: "Accès refusé." });
    return;
  }

  const filePath = path.join(__dirname, '../responses.json'); // Définition du chemin vers le fichier de réponses

  if (!fs.existsSync(filePath)) { // Gestion du cas où aucun fichier de soumissions n'existe
    void res.status(404).json({ error: "Aucune soumission trouvée." });
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8'); 
  // Vérification que le contenu du fichier n'est pas vide
  if (!fileContent) {
    void res.status(404).json({ error: "Aucune soumission disponible." });
    return;
  }

  const submissions = JSON.parse(fileContent); // Lecture et parsing des soumissions existantes

  void res.status(200).json(submissions); // Envoi des soumissions sous forme de JSON au client

};
