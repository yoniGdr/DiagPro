// Composant ContactInput : Champ de formulaire réutilisable pour le formulaire de contact
// Gère l'affichage dynamique des erreurs et le style en fonction de la validité du champ.

// Définition des propriétés attendues par le composant ContactInput
// (label du champ, nom, type d'input, valeur, erreurs, handlers d'événements)
interface ContactInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}
// Composant principal pour afficher un champ de formulaire stylisé avec validation visuelle
export default function ContactInput({
  label,
  name,
  type = "text",
  value,
  error,
  touched,
  onChange,
  onBlur,
}: ContactInputProps) {
  // Détermination de la validité du champ (utile pour la couleur de la bordure)
  const isValid = !error && value.trim();
  // Définir dynamiquement la couleur de la bordure selon l'état du champ
  const borderColor = !touched
    ? "border-gray-300"
    : error
    ? "border-red-400"
    : isValid
    ? "border-green-400"
    : "border-gray-300";

  // Définir dynamiquement la couleur du label selon l'état du champ
  const labelColor = !touched
    ? "text-gray-500"
    : error
    ? "text-red-400"
    : isValid
    ? "text-green-400"
    : "text-gray-500";

  return (
    <div className="relative w-full">
      {/* Label positionné au-dessus de l'input avec couleur dynamique */}
      <label
        htmlFor={name}
        className={`absolute -top-2 left-3 px-1 bg-white text-sm ${labelColor}`}
      >
        {label} <span className="text-[#FF445F]">*</span>
      </label>

      {/* Champ de saisie principal */}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full p-4 pt-5 rounded-lg border-2 ${borderColor} focus:outline-none focus:ring-0`}
        required
      />

      {/* Affichage du message d'erreur si nécessaire */}
      {error && <span className="text-sm text-red-500 mt-1 block">{error}</span>}
    </div>
  );
}
