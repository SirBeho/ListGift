import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/pages/Login";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/pages/Dashboard";
import Profile from "./components/pages/Profile";
import Lists from "./components/pages/Lists";
import Items from "./components/pages/Items";
import { AuthProvider } from "./components/Layout/AuthProvider"; 
import { ListProvider } from "./components/Layout/ListProvider";
import { AnimatePresence } from "framer-motion";



function AppRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/lists" element={<Layout><Lists /></Layout>} />
                <Route path="/lists/:id" element={<Layout><Items /></Layout>} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ListProvider>
          <AppRoutes />
        </ListProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
