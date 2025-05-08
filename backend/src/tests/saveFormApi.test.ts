//  Tests d'intégration pour la route POST /save-form
// Ces tests vérifient que l'API de sauvegarde de formulaire fonctionne correctement et gère les erreurs.
//
// Scénarios testés :
// - Sauvegarde réussie d'un formulaire avec des données valides (retour 200).
// - Rejet d'un formulaire si des champs de contact sont manquants (retour 400).
// - Rejet d'un formulaire si les réponses au questionnaire sont absentes (retour 400).
//
// L'objectif est de garantir que seules des données complètes et valides peuvent être sauvegardées côté serveur.

import { describe, it, expect } from '@jest/globals'
import request from 'supertest';
import { app } from '../app'; 

describe('POST /save-form', () => {
  it('should save form successfully with valid data', async () => {
    const response = await request(app)
      .post('/save-form')
      .send({
        contact: {
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@example.com",
          phone: "0612345678",
          address: "1 rue de Paris",
          postalCode: "75000"
        },
        answers: [
          { questionId: "q__0", answer: "Plomberie" }
        ]
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Données sauvegardées avec succès !");
  });

  it('should fail when missing contact fields', async () => {
    const response = await request(app)
      .post('/save-form')
      .send({
        contact: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          postalCode: ""
        },
        answers: [
          { questionId: "q__0", answer: "Plomberie" }
        ]
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});

it('should fail when missing answers', async () => {
    const response = await request(app)
      .post('/save-form')
      .send({
        contact: {
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@example.com",
          phone: "0612345678",
          address: "1 rue de Paris",
          postalCode: "75000"
        },
      })
      .set('Accept', 'application/json');
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Formulaire incomplet.");
  });
  
