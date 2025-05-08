// Tests unitaires pour la fonction validateAndSanitizeContact
// Ces tests vérifient que la validation et le nettoyage des données de contact fonctionnent correctement.
//
// Scénarios testés :
// - Validation d'un contact complet et propre.
// - Refus d'un contact avec des champs manquants.
// - Refus d'un email invalide.
// - Refus d'un numéro de téléphone invalide.
// - Nettoyage de contenu potentiellement dangereux (ex: scripts XSS).
//
// L'objectif est de garantir que seules des données saines et correctement formatées sont traitées par l'application.

import { describe, it, expect } from '@jest/globals'
import { validateAndSanitizeContact } from '../utils/validator';

describe('validateAndSanitizeContact', () => {
    it('should validate and sanitize a correct contact', () => {
      const contact = {
        firstName: " Jean  ",
        lastName: " Dupont ",
        email: "jean.dupont@example.com ",
        phone: "0612345678 ",
        address: "1 rue de Paris ",
        postalCode: "75000 "
      };
  
      const result = validateAndSanitizeContact(contact);
  
      expect(result.success).toBe(true);
  
      // Vérification que cleanedContact existe
      if (result.cleanedContact) {
        expect(result.cleanedContact.firstName).toBe("Jean");
        expect(result.cleanedContact.lastName).toBe("Dupont");
        expect(result.cleanedContact.email).toBe("jean.dupont@example.com");
      }
    });
  });

  it('should fail with missing fields', () => {
    const contact = {
      firstName: " ",
      lastName: " ",
      email: "",
      phone: "",
      address: "",
      postalCode: ""
    };

    const result = validateAndSanitizeContact(contact);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Tous les champs doivent être remplis.");
  });

  it('should fail with invalid email', () => {
    const contact = {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont",
      phone: "0612345678",
      address: "1 rue de Paris",
      postalCode: "75000"
    };

    const result = validateAndSanitizeContact(contact);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Email invalide.");
});

it('should fail with invalid phone number', () => {
    const contact = {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      phone: "123", // mauvais format
      address: "1 rue de Paris",
      postalCode: "75000"
    };
  
    const result = validateAndSanitizeContact(contact);
  
    expect(result.success).toBe(false);
    expect(result.error).toBe("Numéro de téléphone invalide.");
  });
  
  it('should sanitize inputs with malicious content', () => {
    const contact = {
      firstName: "<script>alert('xss')</script>",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      phone: "0612345678",
      address: "1 rue de Paris",
      postalCode: "75000"
    };
  
    const result = validateAndSanitizeContact(contact);
  
    expect(result.success).toBe(true);
    expect(result.cleanedContact?.firstName).not.toContain("<script>");
    expect(result.cleanedContact?.firstName).toContain("&lt;script&gt;");
  });
  
