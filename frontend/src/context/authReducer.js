

export const initialState = {
    user: JSON.parse(localStorage.getItem("user")),
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    isAdmin: JSON.parse(localStorage.getItem("user"))?.isAdmin || false,
  };
  
  export const authReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN_SUCCESS":
        return {
          ...state,
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
          isAdmin: action.payload.user.isAdmin || false,
        };
  
      case "LOGOUT":
        return {
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        };
  
      default:
        return state;
    }
  };
  