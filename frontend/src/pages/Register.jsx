import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
// Asumo que tu AuthProvider tiene una función 'register'
import { useAuth } from "../providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeftIcon,
    UserIcon,
    LockClosedIcon,
    EnvelopeIcon, // Nuevo icono para email
    EyeIcon,
    EyeSlashIcon
} from "@heroicons/react/24/outline";
import { FaGoogle, FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import classNames from 'classnames';

export default function Register() {
    const navigate = useNavigate();
    // Asumo que tienes una función 'register' en useAuth
    const { user, register } = useAuth();
    const [msj, setMsj] = useState({});
    const [formData, setFormData] = useState({
        username: "",
        email: "", // Nuevo campo
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Redirige si el usuario ya está logueado
    useEffect(() => {
        if (user) navigate("/profile");
    }, [navigate, user]);

    const handleTogglePassword = useCallback(() => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    }, []);

    const handleInputChange = useCallback((event) => {
        setMsj({});
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }, [setFormData]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        // Llama a la función de registro
        const result = await register(formData);
        setLoading(false);

        if (result.success) {
            setMsj({ msj: "¡Registro exitoso! Por favor, inicia sesión." });

            // Redirige al login después de un registro exitoso
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } else {
            const errorData = result.message
                ? { error: result.message }
                : { error: "Fallo en el registro. Inténtalo de nuevo." };
            setMsj(errorData);
            setFormData((prevFormData) => ({ ...prevFormData, password: "" }));
        }
    }, [register, formData, navigate, setLoading, setMsj, setFormData]);

    useEffect(() => {
        if (Object.keys(msj).length > 0) {
            const timer = setTimeout(() => {
                setMsj({});
            }, 5000);
            return () => clearTimeout(timer); // Limpia el timeout si el componente se desmonta
        }
    }, [msj]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-yellow-100 px-6">
            {/* Botón Volver */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 left-6 z-50">
                <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-medium text-sm group">
                    <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Seguir explorando
                </Link>
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key="register-card"
                    initial={{ x: 160, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -160, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="bg-white shadow-2xl shadow-primary/10 rounded-[1.5rem] border-t-primary border-t-8 max-w-md w-full p-8 relative z-10"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            Únete a <span className="text-primary">ListGift</span>
                        </h2>
                        <p className="text-slate-500 font-medium mt-2">
                            Empieza a organizar tus deseos hoy mismo
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 ring-orange-200 transition">
                            <UserIcon className="h-5 w-5 text-primary mr-2" />
                            <input
                                aria-label="Nombre de usuario"
                                type="text"
                                name="username"
                                placeholder="Usuario"
                                required
                                autoComplete="username"
                                onChange={handleInputChange}
                                className="w-full outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 ring-orange-200 transition">
                            <EnvelopeIcon className="h-5 w-5 text-primary mr-2" />
                            <input
                                aria-label="Email"
                                type="email"
                                name="email"
                                placeholder="Correo Electrónico"
                                required
                                autoComplete="email"
                                onChange={handleInputChange}
                                className="w-full outline-none"
                            />
                        </div>

                        {/* Password (Igual que en Login) */}
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 ring-orange-200 transition relative">
                            <LockClosedIcon className="h-5 w-5 text-primary mr-2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Contraseña"
                                required
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full outline-none pr-8"
                            />
                            <button
                                type="button"
                                onClick={handleTogglePassword}
                                className="absolute right-3 text-primary hover:text-pink-600"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {/* Mensajes */}
                        {Object.entries(msj).map(([key, value], i) => (
                            <p
                                key={i}
                                className={classNames("text-center", {
                                    "text-green-600": key === "msj",
                                    "text-red-500": key === "error",
                                })}
                            >
                                {value}
                            </p>
                        ))}

                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={loading}
                            className={classNames(
                                "w-full py-2 rounded-lg transition duration-300 shadow",
                                {
                                    "bg-orange-200 cursor-not-allowed": loading,
                                    "bg-primary hover:bg-orange-600 text-white": !loading,
                                }
                            )}
                        >
                            {loading ? "Creando cuenta..." : "Registrarme"}
                        </motion.button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login" className="text-primary hover:underline">
                            Inicia sesión
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>
        </main>
    );
}

