import React, { createContext, useState, useEffect, useMemo } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refreshToken, setrefreshToken] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedrefreshToken = localStorage.getItem("token");
    setrefreshToken(storedrefreshToken)
    setToken(storedToken);
    //console.log(storedToken)
    setLoading(false);
  }, []);


  // Calculate isAuthenticated based on the presence of the token
  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
