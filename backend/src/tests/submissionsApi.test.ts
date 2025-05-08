// Tests d'intégration pour la route GET /submissions
// Ces tests vérifient le comportement de sécurité et d'accès de l'endpoint permettant de récupérer les soumissions.
//
// Scénarios testés :
// - Refus de l'accès sans clé API.
// - Refus de l'accès avec une clé API incorrecte.
// - Acceptation de l'accès avec une clé API correcte (retour 200 ou 404 si aucune donnée).
//
// L'objectif est de garantir que les soumissions ne sont accessibles qu'aux utilisateurs authentifiés via une clé API sécurisée.

import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';

describe('GET /submissions', () => { // Test de l'API pour récupérer les soumissions
  it('should return 403 if no apiKey is provided', async () => {
    const response = await request(app)
      .get('/submissions');

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Accès refusé.");
  });
  
  it('should return 403 if apiKey is wrong', async () => { 
    const response = await request(app)
      .get('/submissions?apiKey=wrongkey');

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Accès refusé.");
  });

  it('should return 200 if correct apiKey is provided', async () => {
    const response = await request(app)
      .get('/submissions?apiKey=goweb2025');

    // même si pas encore de données, on doit recevoir 200 (ou 404 si responses.json vide)
    expect([200, 404]).toContain(response.status);
  });
});
