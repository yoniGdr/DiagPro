// 🎯 Fonction utilitaire : validation et nettoyage des données de contact avant enregistrement
// Utilise la librairie 'validator' pour éviter toute injection ou données mal formatées

import validator from 'validator';

// Typage TypeScript pour un contact utilisateur
interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
}

// Fonction principale qui valide et nettoie un objet Contact
// Retourne un objet { success: boolean, cleanedContact | error: string }
export const validateAndSanitizeContact = (contact: Contact) => {
  let { firstName, lastName, email, phone, address, postalCode } = contact;
  // Nettoyage : supprime les caractères dangereux (ex: éviter les attaques XSS)
  // et retire les espaces superflus autour des champs
  firstName = validator.escape(firstName?.trim() || "");
  lastName = validator.escape(lastName?.trim() || "");
  email = validator.escape(email?.trim() || "");
  phone = validator.escape(phone?.trim() || "");
  address = validator.escape(address?.trim() || "");
  postalCode = validator.escape(postalCode?.trim() || "");

  // Vérification que tous les champs obligatoires sont remplis après nettoyage
  if (!firstName || !lastName || !email || !phone || !address || !postalCode) {
    return { success: false, error: "Tous les champs doivent être remplis." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validation du format de l'email
  if (!emailRegex.test(email)) {
    return { success: false, error: "Email invalide." };
  }

  const phoneRegex = /^\d{10}$/; // Validation du format du numéro de téléphone (10 chiffres attendus sans espace)
  if (!phoneRegex.test(phone)) {
    return { success: false, error: "Numéro de téléphone invalide." };
  }
  // Retour du contact nettoyé si toutes les validations passent
  return {
    success: true,
    cleanedContact: { firstName, lastName, email, phone, address, postalCode }
  };
};
