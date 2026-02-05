import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import { RequireAuth, PublicRoute } from "./guards/AuthControl";
import Layout from "./Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Lists from "./pages/Lists";
import Home from "./pages/Home";
import Register from "./pages/Register";
import List from "./pages/List";
import PusherListener from "./service/PusherListener";
import { AuthProvider } from "./providers/AuthProvider";
import { ListProvider } from "./providers/ListProvider";
import { AnimatePresence } from "framer-motion";


function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>


        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lists/:id" element={<List />} />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/lists" element={<Lists />} />
          </Route>
        </Route>

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const handleRealtimeUpdate = (data) => {
    // 🚨 Aquí va la lógica para actualizar un estado global
    // que controla la visibilidad y contenido del modal global.
    console.log('Recibido evento en tiempo real:', data);

    // Ejemplo: setGlobalModal({ show: true, data: data });
  };
  return (
    <BrowserRouter>
      <ListProvider>
        <AuthProvider>
          <PusherListener onUpdateItemStatus={handleRealtimeUpdate} />
          <AppRoutes />
        </AuthProvider>
      </ListProvider>
    </BrowserRouter>
  );
}

export default App;
