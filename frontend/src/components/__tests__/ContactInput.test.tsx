// Tests unitaires du composant ContactInput
// Ces tests s'assurent que le composant d'input personnalisé pour le formulaire de contact fonctionne correctement.
//
// Scénarios testés :
// - Le champ est bien affiché avec son label associé.
// - Si une erreur est présente, elle est correctement affichée sous le champ.

/// <reference types="vitest" />

import { render, screen } from '@testing-library/react';
import ContactInput from '../ContactInput';

describe('ContactInput', () => {
  it('affiche correctement un label et un champ', () => {
    render(
      <ContactInput
        name="firstName"
        label="Prénom"
        value=""
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('affiche un message d’erreur si erreur', () => {
    render(
      <ContactInput
        name="firstName"
        label="Prénom"
        value=""
        error="Ce champ est requis"
        touched={true}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    expect(screen.getByText(/Ce champ est requis/i)).toBeInTheDocument();
  });
});
