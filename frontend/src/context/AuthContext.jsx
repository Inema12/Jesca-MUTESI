import { createContext, useContext, useEffect, useState } from "react";
import { authApi, getToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("codebridge_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    authApi.profile()
      .then(({ user: profile }) => {
        setUser(profile);
        localStorage.setItem("codebridge_user", JSON.stringify(profile));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const result = await authApi.login(credentials);
    localStorage.setItem("codebridge_token", result.token);
    localStorage.setItem("codebridge_user", JSON.stringify(result.user));
    setUser(result.user);
    return result;
  }

  function logout() {
    localStorage.removeItem("codebridge_token");
    localStorage.removeItem("codebridge_user");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
