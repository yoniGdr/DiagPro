/**
 * Page Contact
 * 
 * Cette page permet à l'utilisateur de renseigner ses informations personnelles
 * (prénom, nom, adresse, code postal, téléphone, email) après avoir terminé le questionnaire.
 * 
 * Fonctionnalités principales :
 * - Validation de chaque champ (regex pour email, téléphone, code postal, etc.).
 * - Affichage d'un message d'erreur en cas de champ invalide.
 * - Désactivation du bouton "Envoyer" tant que tous les champs ne sont pas correctement remplis.
 * - Envoi des données vers l'API backend via une requête POST.
 * - Redirection automatique vers l'accueil si l'utilisateur accède à la page sans avoir répondu au questionnaire.
 * - Affichage d'un message de remerciement en cas de soumission réussie.
 * 
 * Remarques :
 * - Ce formulaire utilise un fichier JSON pour récupérer les questions initiales.
 * - En mode production, la clé API et les chemins critiques devront être sécurisés via des variables d'environnement.
 */

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionnaireContext } from "../context/QuestionnaireContext";
import Footer from "../components/Footer";
import ContactInput from "../components/ContactInput";
import Header from "../components/Header";
import BackButton from "../components/BackButton";

const fields = [
  { name: "firstName", label: "Prénom" },
  { name: "lastName", label: "Nom" },
  { name: "address", label: "Adresse (numéro et voie)" },
  { name: "postalCode", label: "Code postal" },
  { name: "phone", label: "Téléphone" },
  { name: "email", label: "Adresse email" },
] as const;

// Type Type pour les noms de champs
type FieldName = typeof fields[number]["name"];

// Type pour les champs du formulaire
function Contact() {
  const navigate = useNavigate();
  const questionnaireContext = useContext(QuestionnaireContext);

  // Redirection vers la page d'accueil si le questionnaire n'a pas été rempli
  useEffect(() => {
    if (questionnaireContext && questionnaireContext.answers.length === 0) {
      navigate("/");
    }
  }, [questionnaireContext, navigate]);

  // Initialisation des états pour le formulaire
  const [formData, setFormData] = useState<Record<FieldName, string>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: ""
  });

  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({}); // Erreurs de validation
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({}); // Champs touchés
  const [submitted, setSubmitted] = useState(false); // État de soumission

  // Fonction de validation individuelle d'un champ
  const validateField = (name: FieldName, value: string) => {
    if (!value.trim()) return "Ce champ est requis";
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) return "Adresse email invalide";
    if (name === "phone" && !/^[0-9]{10}$/.test(value.replace(/\s/g, ""))) return "Numéro de téléphone invalide";
    if (name === "postalCode" && !/^\d{5}$/.test(value)) return "Code postal invalide";
    if (name === "address" && !/^\d{1,5}\s[\p{L}\s'-]+$/u.test(value)) return "Adresse invalide (ex: 10 Rue de Paris)";
    return "";
  };

  // Gestion des changements de valeur dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: FieldName; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };
  // Gestion de la perte de focus sur les champs du formulaire
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: FieldName; value: string };
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  // Fonction de validation complète du formulaire
  const validateForm = () => {
    const newErrors: Partial<Record<FieldName, string>> = {};
    fields.forEach(({ name }) => {
      const error = validateField(name, formData[name]);
      if (error) newErrors[name] = error;
    });
    return newErrors;
  };

  // Vérification si le formulaire est "globalement" valide
  const isFormValid = fields.every(({ name }) => {
    const value = formData[name];
    const error = validateField(name, value);
    return value.trim() && !error;
  });
  // Fonction appelée à la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionnaireContext) return;

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { // Si des erreurs sont présentes, on les affiche
      setErrors(newErrors);
      setTouched(Object.fromEntries(fields.map(({ name }) => [name, true])) as Partial<Record<FieldName, boolean>>);
      return;
    }
    const payload = {
      contact: formData,
      answers: questionnaireContext.answers,
    };

    try { // Envoi des données vers le backend
      const response = await fetch('http://localhost:3000/save-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) { 
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        console.error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  if (submitted) { // Si le formulaire a été soumis avec succès, on affiche un message de remerciement
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
        <div className="flex-1 flex flex-col items-center mt-4 p-6">
          <h1 className="text-3xl font-bold text-primary mb-4">Merci !</h1>
          <p className="text-gray-700 text-center">Nous avons bien reçu vos informations. Un expert vous contactera bientôt.</p>
        </div>
        <Footer />
      </div>
    );
  }
  // Sinon, affichage du formulaire
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Header />
      <div className="flex-1 p-6">
        {/* Titre de la page */}

        <h1 className="text-3xl font-bold text-primary text-center mb-10">Informations</h1>
        {/* Petite vague déco */}
        <div className="my-6">
          <img src="/icons/wave.svg" alt="Décoration vague" className="h-4 mx-auto" />
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-10 rounded-lg shadow-md">
          {fields.map(({ name, label }) => (
            <ContactInput
              key={name}
              name={name}
              label={label}
              value={formData[name]}
              error={errors[name]}
              touched={touched[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              type={name === "email" ? "email" : "text"}
            />
          ))}

          {/* Boutons de navigation */}
          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
            <BackButton onClick={() => navigate("/result")} />
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-auto mt-6 font-semibold py-4 px-6 rounded-full border-2 transition-colors duration-200 ${isFormValid
                  ? "bg-[#FF445F] text-white border-[#FF445F] hover:bg-[#8F0C30] hover:border-[#8F0C30]"
                  : "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
                }`}
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
