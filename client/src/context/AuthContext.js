import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("token"));

  const register = async (username, email, password) => {
    try {
      console.log("Attempting registration with:", { username, email }); // Debug log
      const res = await axios.post(
        "http://localhost:7777/api/auth/register",
        {
          username,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration response:", res.data); // Debug log

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.token);
        return true;
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Registration error:", error.response || error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:7777/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.token);
        return true;
      }
    } catch (error) {
      console.error("Login error:", error.response || error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
