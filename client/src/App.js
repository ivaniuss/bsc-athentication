import React, { Fragment, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link 
} from "react-router-dom";

import { toast } from "react-toastify";

//components

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

toast.configure();

function App() {
  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/is-verify", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      const parseRes = await res.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  return (
    <Fragment>
      <Router>
          <div className = 'container'>
            <Routes>
                <Route
                path="/login"
                element={
                   <Login setAuth={setAuth} />
                }
                />
                <Route
                path="/"
                element={
                   <Login setAuth={setAuth} />
                }
                />

                <Route
                path="/register"
                element={
                   <Register setAuth={setAuth} />
                }
                />
                <Route
                path="/dashboard"
                element={
                   <Dashboard setAuth={setAuth} />
                }
                />
            </Routes>
          </div>
      </Router>
    </Fragment>
  );
}

export default App;
