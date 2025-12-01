import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Layout/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon
} from "@heroicons/react/24/outline";
import { FaGoogle, FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import classNames from 'classnames';
import Gift3d from './../Layout/Gift3d';

export default function Login() {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [msj, setMsj] = useState(JSON.parse(sessionStorage.getItem("msj")) || {});
    const [formData, setFormData] = useState({ username: "benjamin000", password: "1234" });
    const [showPassword, setShowPassword] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
const [loading, setLoading] = useState(false);

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
        const result = await login(formData);
        setLoading(false);

        if (result.success) {
            setMsj({ msj: "Acceso autorizado" });
            //setRedirecting(true);
            // Esperar a que termine la animación antes de navegar
            /* setTimeout(() => {
                navigate("/profile");
            }, 600);  */
        } else {
            console.log(result)
            const errorData = result.message
                ? { error: result.message }
                : { error: "Credenciales inválidas" };
            setMsj(errorData);
            setFormData((prevFormData) => ({ ...prevFormData, password: "" }));
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
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-yellow-100 px-6">
            
            <AnimatePresence mode="wait">
                {!redirecting && (
                    <motion.div
                        key="login"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -500, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white shadow-xl rounded-2xl border-t-pink-500 border-t-8 max-w-md w-full p-8 pt-0 overflow-hidden absolute"
                    >
                        <div className="absolute h-full mb-9 bg-transparent ">

                            <Gift3d  />
                        </div>
                        <motion.div className="text-center mb-6 mt-52 bg-transparent relative z-10">
                            
                            <h2 className="text-3xl font-bold text-pink-600 bg-transparent ">
                                Bienvenido a Giftly
                            </h2>
                            
                            <p className="text-gray-500">
                                Ingresa y encuentra el regalo perfecto
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {/* Username */}
                            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 ring-pink-300 transition">
                                <UserIcon className="h-5 w-5 text-pink-400 mr-2" />
                                <input
                                    aria-label="Nombre de usuario"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    placeholder="Usuario"
                                    required
                                    onChange={handleInputChange}
                                    className="w-full outline-none"
                                />
                            </div>

                            {/* Password */}
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
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit"
                                disabled={loading} className={classNames(
                                    "w-full py-2 rounded-lg transition duration-300 shadow",
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
                        <div className="mt-6 text-center text-sm text-gray-500">
                            O entra con:
                        </div>

                        {/* Social Icons */}
                        <div className="mt-4 flex justify-center space-x-4">
                            <SocialIcon icon={<FaGoogle />} url="https://www.google.com" />
                            <SocialIcon icon={<FaFacebookF />} url="https://www.facebook.com" />
                            <SocialIcon icon={<FaTwitter />} url="https://twitter.com" />
                            <SocialIcon icon={<FaGithub />} url="https://github.com" />
                        </div>

                        {/* Register Link */}
                        <div className="mt-6 text-center text-sm text-gray-500">
                            ¿No tienes cuenta?{" "}
                            <Link to="/register" className="text-pink-500 hover:underline">
                                Regístrate
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

// Social button reusable
function SocialIcon({ icon, url }) {
    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full border bg-white text-pink-500 hover:bg-pink-100 shadow transition"
        >
            {icon}
        </motion.a>
    );
}