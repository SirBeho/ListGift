
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon, ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { FaGoogle, FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import classNames from 'classnames';
import Gift3d from '../components/Gift3d';
import Alert from '../components/Alert';
import { useParams } from "react-router-dom";


export default function Login() {
    const { login } = useAuth();

    const navigate = useNavigate(); // El encargado de redirigir
    const { state } = useLocation();
    const from = state?.from || '/dashboard';

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

                navigate(from, { replace: true });
            }, 500); // Duración de la animación de salida */
        } catch (err) {
            console.log(err);
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
        <main className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 px-4 sm:px-6 py-10  overflow-hidden">

            {/* Botón Volver */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 left-6 z-50">
                <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-medium text-sm group">
                    <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Volver al inicio
                </Link>
            </motion.div>

            <AnimatePresence mode="wait">
                {!animating && (
                    <motion.div
                        key="login-card"
                        initial={{ x: 160, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -160, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="bg-white shadow-2xl shadow-primary/50 rounded-3xl    border-t-primary border-t-8 w-full max-w-sm sm:max-w-md h- p-6 sm:p-8 pt-0 relative z-10 overflow-hidden"

                    >
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                            <Gift3d />
                        </div>

                        <div className="text-center mb-6 mt-52 sm:mt-52 md:mt-48 relative z-10">
                            <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                                Bienvenido a ListGift
                            </h2>
                            <p className="text-sm sm:text-base text-slate-500 font-medium">
                                Ingresa y encuentra el regalo perfecto
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                            {/* Input Username */}
                            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 ring-primary/20 focus-within:border-primary transition bg-slate-50/50">
                                <UserIcon className="h-5 w-5 text-primary/40 mr-3" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Usuario"
                                    className="w-full outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
                                    onChange={handleInputChange}
                                    value={formData.username}
                                />
                            </div>

                            {/* Input Password */}
                            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 ring-primary/20 focus-within:border-primary transition bg-slate-50/50 relative">
                                <LockClosedIcon className="h-5 w-5 text-primary/40 mr-3" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Contraseña"
                                    className="w-full outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
                                    onChange={handleInputChange}
                                    value={formData.password}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-300 hover:text-primary transition-colors">
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>

                            <Alert apiRes={apiRes} />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-primary hover:brightness-105 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:bg-slate-200"
                            >
                                {loading ? "Ingresando..." : "Iniciar sesión"}
                            </button>
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


                        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
                            ¿No tienes cuenta?{" "}
                            <Link to="/register" className="text-primary hover:underline font-bold">
                                Regístrate gratis
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
            className="p-2.5 sm:p-3 rounded-full border bg-white text-primary hover:bg-pink-100 shadow transition flex items-center justify-center"
        >
            {icon}
        </motion.a>
    );
}