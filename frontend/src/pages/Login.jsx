import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon
} from "@heroicons/react/24/outline";
import { FaGoogle, FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import classNames from 'classnames';
import Gift3d from '../components/Gift3d';
import Alert from '../components/Alert';
import { useParams } from "react-router-dom";


export default function Login() {
    const { user, loading: cargando, redirecting, login } = useAuth();
    const { redirectTo } = useParams();

    const navigate = useNavigate(); // El encargado de redirigir

    const [formData, setFormData] = useState({ username: "benjamin000", password: "123" });
    const [apiRes, setApiRes] = useState(null);

    const [msj, setMsj] = useState(JSON.parse(sessionStorage.getItem("msj")) || {});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [animating, setAnimating] = useState(false); // Nuevo estado para controlar la animación de salida

    // Hooks y lógica se mantienen igual...
    const handleInputChange = (event) => {
        setMsj({});
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiRes(null);
        setLoading(true);
        try {
            await login(formData);
            setAnimating(true);
            setTimeout(() => {
                navigate(redirectTo || "/dashboard", { replace: true });
            }, 500); // Duración de la animación de salida */
        } catch (err) {
            console.log('aqiui')
            setLoading(false);
            setApiRes(err);
        }
    };

    useEffect(() => {
        if (Object.keys(msj).length > 0) {
            setTimeout(() => {
                setMsj({});
                sessionStorage.removeItem("msj");
            }, 5000);
        }
    }, [msj]);


    return (
        // CAMBIO 1: px-4 para móviles, sm:px-6 para tablets+
        <main className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-yellow-100 px-4 sm:px-6 py-10 overflow-hidden">

            <AnimatePresence mode="wait">
                {!animating && (
                    <motion.div
                        key="login"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -500, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        // CAMBIO 2: Quite 'absolute' para evitar problemas de scroll en móviles pequeños.
                        // Ajusté anchos: w-full, max-w-sm (móvil), sm:max-w-md (escritorio).
                        // Ajusté padding: p-6 (móvil), sm:p-8 (escritorio).
                        className="bg-white shadow-xl rounded-2xl border-t-pink-500 border-t-8 w-full max-w-sm sm:max-w-md p-6 sm:p-8 pt-0 relative z-10 overflow-hidden"
                    >
                        {/* Contenedor del Regalo 3D */}
                        {/* CAMBIO 3: Ajustamos la altura y posición del regalo. En móvil es más pequeño o ajustado */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                            {/* Asegúrate de que Gift3d tenga un tamaño controlado o sea responsive internamente */}
                            <Gift3d />
                        </div>

                        {/* Contenedor de Textos */}
                        {/* CAMBIO 4: Reduje el mt drasticamente para móvil. 
                            mt-32 (móvil) -> sm:mt-40 -> md:mt-52 (escritorio original) 
                            Esto sube el formulario para que quepa el teclado en el celular */}
                        <motion.div className="text-center mb-6 mt-32 sm:mt-40 md:mt-52 relative z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-pink-600">
                                Bienvenido a Giftly
                            </h2>
                            <p className="text-sm sm:text-base text-gray-500">
                                Ingresa y encuentra el regalo perfecto
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 relative z-10">

                            {/* Username */}
                            <div className={`${apiRes?.errors?.username ? 'border-red-500' : ''} flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 ring-pink-300 transition bg-white`}>
                                <UserIcon className="h-5 w-5 text-pink-400 mr-2 flex-shrink-0" />
                                <input
                                    aria-label="Nombre de usuario"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    placeholder="Usuario"
                                    required
                                    onChange={handleInputChange}
                                    className="w-full outline-none bg-transparent text-sm sm:text-base"
                                />
                            </div>

                            {/* Password */}
                            <div className={`${apiRes?.errors?.password ? 'border-red-500' : ''} flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 ring-pink-300 transition bg-white`}>
                                <LockClosedIcon className="h-5 w-5 text-pink-400 mr-2 flex-shrink-0" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Contraseña"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full outline-none pr-8 bg-transparent text-sm sm:text-base"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-pink-400 hover:text-pink-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            <Alert apiRes={apiRes} />

                            {/* Mensajes de error/éxito */}
                            {Object.entries(msj).map(([key, value], i) => (
                                <p
                                    key={i}
                                    className={classNames("text-center text-sm font-medium", {
                                        "text-green-600": key === "msj",
                                        "text-red-500": key === "error",
                                    })}
                                >
                                    {value}
                                </p>
                            ))}

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }} // Escala reducida en móvil para no ser brusco
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={loading}
                                className={classNames(
                                    "w-full py-2.5 rounded-lg transition duration-300 shadow text-sm sm:text-base font-medium",
                                    {
                                        "bg-pink-300 cursor-not-allowed": loading,
                                        "bg-pink-500 hover:bg-pink-600 text-white": !loading,
                                    }
                                )}
                            >
                                {loading ? "Ingresando..." : "Iniciar sesión"}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
                            O entra con:
                        </div>

                        {/* Social Icons - Flex wrap para seguridad en pantallas diminutas */}
                        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4 relative z-10">
                            <SocialIcon icon={<FaGoogle />} url="https://www.google.com" />
                            <SocialIcon icon={<FaFacebookF />} url="https://www.facebook.com" />
                            <SocialIcon icon={<FaTwitter />} url="https://twitter.com" />
                            <SocialIcon icon={<FaGithub />} url="https://github.com" />
                        </div>

                        {/* Register Link */}
                        <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 relative z-20">
                            ¿No tienes cuenta?{" "}
                            <Link to="/register" className="text-pink-500 hover:underline font-medium">
                                Regístrate
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

// Botón social ajustado
function SocialIcon({ icon, url }) {
    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 sm:p-3 rounded-full border bg-white text-pink-500 hover:bg-pink-100 shadow transition flex items-center justify-center"
        >
            {icon}
        </motion.a>
    );
}