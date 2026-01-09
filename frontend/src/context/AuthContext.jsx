import { createContext, useReducer } from "react";
import { authReducer, initialState } from "./authReducer";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (data) => {
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        token: data.token,
        user: data.user,
      },
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
