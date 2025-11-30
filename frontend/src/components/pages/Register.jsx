import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// Asumo que tu AuthProvider tiene una función 'register'
import { useAuth } from "../Layout/AuthProvider"; 
import { motion, AnimatePresence } from "framer-motion";
import {
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

    const handleInputChange = (event) => {
        setMsj({});
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Llama a la función de registro
        const result = await register(formData); 
        setLoading(false);

        if (result.success) {
            setMsj({ msj: "¡Registro exitoso! Por favor, inicia sesión." });
            
            // Redirige al login después de un registro exitoso
            setTimeout(() => {
                navigate("/login"); 
            }, 2000); 
            
        } else {
            const errorData = result.message
                ? { error: result.message }
                : { error: "Fallo en el registro. Inténtalo de nuevo." };
            setMsj(errorData);
            setFormData((prevFormData) => ({ ...prevFormData, password: "" }));
        }
    };

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
            <AnimatePresence mode="wait">
                <motion.div
                    key="register"
                    initial={{ x: 500, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white shadow-xl rounded-2xl border-t-pink-500 border-t-8 max-w-md w-full p-8 "
                >
                    <motion.div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-pink-600">
                            ✍️ Crea tu Cuenta
                        </h2>
                        <p className="text-gray-500">
                            Regístrate para empezar a organizar tus regalos
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 ring-pink-300 transition">
                            <UserIcon className="h-5 w-5 text-pink-400 mr-2" />
                            <input
                                aria-label="Nombre de usuario"
                                type="text"
                                name="username"
                                placeholder="Usuario"
                                required
                                onChange={handleInputChange}
                                className="w-full outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 ring-pink-300 transition">
                            <EnvelopeIcon className="h-5 w-5 text-pink-400 mr-2" />
                            <input
                                aria-label="Email"
                                type="email"
                                name="email"
                                placeholder="Correo Electrónico"
                                required
                                onChange={handleInputChange}
                                className="w-full outline-none"
                            />
                        </div>
                        
                        {/* Password (Igual que en Login) */}
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 ring-pink-300 transition relative">
                            <LockClosedIcon className="h-5 w-5 text-pink-400 mr-2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Contraseña"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full outline-none pr-8"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-pink-400 hover:text-pink-600"
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
                                    "bg-pink-300 cursor-not-allowed": loading,
                                    "bg-pink-500 hover:bg-pink-600 text-white": !loading,
                                }
                            )}
                        >
                            {loading ? "Creando cuenta..." : "Registrarme"}
                        </motion.button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login" className="text-pink-500 hover:underline">
                            Inicia sesión
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>
        </main>
    );
}

// Social button reusable (De tu componente anterior)
function SocialIcon({ icon, url }) {
    // ... código de SocialIcon ...
}