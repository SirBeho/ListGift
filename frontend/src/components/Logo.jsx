import { Link } from "react-router-dom";

const Logo = ({ negativo = false, letra = false }) => {

    return (
        <Link to="/"
            className="flex items-center justify-center   border-b border-slate-100/50 shrink-0 group cursor-pointer">
            {/* Contenedor del Icono con Tonalidades */}
            <div className="relative ">
                {/* Brillo de fondo (Glow) para dar profundidad */}

                {negativo ? (
                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f1786f] via-[#f1786f] to-[#ff9a8d] flex items-center justify-center shadow-lg shadow-[#f1786f]/30 shrink-0 border border-white/20">

                        <div className="absolute -inset-1 bg-gradient-to-tr from-[#f1786f] to-[#ff9a8d] rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                        <img
                            src="../pictures/logo.png"
                            alt="Logo"
                            className="w-full h-full object-cover brightness-0 invert p-0.5 transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-xl overflow-hidden bg-indigo-100 border-[#f1786f] border-2">
                        <img src="../pictures/logo.png" alt="Logo" className="w-full h-full object-cover bg-white group-hover:scale-110 transition duration-300 " />
                    </div>)}
            </div>

            {/* Texto con Tonalidad de Marca */}
            {letra && (
                <span className="ml-2 transition-opacity duration-300 whitespace-nowrap">
                    <span className="font-bold text-xl text-slate-800 tracking-tight">List</span>
                    <span className="font-extrabold text-xl text-[#f1786f] tracking-tight">Gift</span>
                </span>
            )}
        </Link>

    );
};

export default Logo;