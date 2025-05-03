import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/pages/Dashboard";
import Profile from "./components/pages/Profile";
import Person from "./components/pages/Person";
import Rol from "./components/pages/Rol";
import Log from "./components/pages/Log";
import Link from "./components/pages/Link";
import User from "./components/pages/User";
import Lists from "./components/pages/Lists";
import { AuthProvider, useAuth } from "./components/Layout/AuthProvider"; 
import { ListProvider , useList } from "./components/Layout/ListProvider"; // Importa el ListProvider

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <ListProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/lists" element={<Layout><Lists /></Layout>} />


            <Route path="/Person" element={<Layout><Person /></Layout>} />
            <Route path="/rol" element={<Layout><Rol /></Layout>} />
            <Route path="/log" element={<Layout><Log /></Layout>} />
            <Route path="/link" element={<Layout><Link /></Layout>} />
            <Route path="/user" element={<Layout><User /></Layout>} />
          </Routes>
          </ListProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}


export default App;