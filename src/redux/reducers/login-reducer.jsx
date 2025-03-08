const initialState = {
    isLogin: false, // ✅ Default value to prevent "undefined" errors
  };
  
  const loginReducer = (state = initialState, action) => {
    switch (action.type) {
      case "LOGIN":
        return {
          ...state,
          isLogin: action.payload, // ✅ Correctly updating login state
        };
      default:
        return state;
    }
  };
  
  export default loginReducer;
  