const initialState = { isLogin: false };

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLogin: action.payload }; // ✅ Ensure it updates state
    default:
      return state;
  }
};

export default loginReducer;
  