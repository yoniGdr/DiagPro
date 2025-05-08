import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between bg-[#FFFFFF] items-stretch h-12 w-full">
      <div
        className="flex items-center bg-[#3C3532] px-6"
      >
        <img src="/icons/Goweb..svg" alt="Goweb Logo" className="h-3" />
      </div>

      <button
        onClick={() => navigate("/contact")}
        className="bg-[#FF445F] px-6 flex items-center text-white font-semibold hover:bg-[#8F0C30] transition-colors duration-200"
      >
        Contact
      </button>
    </header>
  );
}
