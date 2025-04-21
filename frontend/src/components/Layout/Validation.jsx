import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Validation() {
  const navigate = useNavigate();

  const ValidationTokenPage = async () => {
  try {

    if (!sessionStorage.getItem("myToken")) {
      throw new Error(`La sesion esta vencida o no existe`);
    }

    const response1 = await axios.post("http://localhost:8000/api/auth/me");

    if (!response1.data.message) {
      throw new Error(`La sesion esta vencida o no existe`);
    }

    const rolId = response1.data.message.rol_id;
    const currentPath = window.location.pathname;

    if (currentPath === '/dashboard' || currentPath === '/profile' || response1.data.message.rol_id == 1) {
      return response1.data.message;
    }

    const response2 = await axios.get("http://localhost:8000/api/rolpage");
    const tienePermiso = response2.data.some((item) => (item.rol_id == rolId && item.page?.url == currentPath) );

    if (!tienePermiso) {
      sessionStorage.setItem("msj",`{"error":"No tienes permiso para entrar en ${currentPath}"}`);
      navigate("/dashboard");
    }
    return response1.data.message;
  } catch (error) {
   
    sessionStorage.setItem("msj",`{"error":"${error.message}"}`);
    navigate("/");
    throw error.message;
  }

}

  return {ValidationTokenPage};
}