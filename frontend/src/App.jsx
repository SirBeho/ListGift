import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/pages/Dashboard";
import Profile from "./components/pages/profile";
import Person from "./components/pages/Person";
import Rol from "./components/pages/Rol";
import Log from "./components/pages/Log";
import Link from "./components/pages/Link";
import User from "./components/pages/User";


function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={ <Layout> <Dashboard />  </Layout>  }  />
          <Route path="/profile" element={ <Layout> <Profile/> </Layout>  }  />
          <Route path="/Person" element={ <Layout> <Person/> </Layout>  }  />
          <Route path="/rol" element={ <Layout> <Rol/> </Layout>  }  />
          <Route path="/log" element={ <Layout> <Log/> </Layout>  }  />
          <Route path="/link" element={ <Layout> <Link/> </Layout>  }  />
          <Route path="/user" element={ <Layout> <User/> </Layout>  }  />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
