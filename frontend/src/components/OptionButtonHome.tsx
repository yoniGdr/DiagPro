// 🎯 Composant d'option affiché sur la page d'accueil du questionnaire
// Affiche une icône et un label. 
// Change de couleur et d'image au survol (hover).
// Permet à l'utilisateur de commencer ou choisir une catégorie.

// Propriétés attendues par le composant OptionButtonHome
interface OptionButtonHomeProps {
    option: { value: string; label: string };
    onClick: (value: string) => void;
  }
  
  // Composant principal pour afficher un bouton d'option sur la page d'accueil
  export default function OptionButtonHome({ option, onClick }: OptionButtonHomeProps) {
    return (
      <button
        onClick={() => onClick(option.value)}
        className="group flex flex-col items-center justify-center bg-[#FFF0F1] hover:bg-[#FF445F] transition-colors duration-200 p-3 pt-6 rounded-lg shadow-md"
      >
        {/* Conteneur des deux icônes superposées (normale et hover) */}
        <div className="relative w-16 h-16 mb-4">
          
          {/* Icône normale */}
          <img
            src={`/icons/${option.value}.svg`}
            alt={option.label}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
          />
          {/* Icône alternative affichée au survol */}
          <img
            src={`/icons/${option.value}-white.svg`}
            alt={`${option.label} blanc`}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
        </div>
        {/* Label sous l'icône qui change de couleur au survol */}
        <span
          className="bg-[#FF445F] text-[#FFF0F1] mt-2 font-bold text-center px-2 py-0 group-hover:bg-[#FFF0F1] group-hover:text-[#FF445F] transition-colors duration-300"
        >
          {option.label}
        </span>
      </button>
    );
  }
  