export const PersonalDetailsReducer = (
  state = { personalDetails: false },
  actions
) => {
  const { type, payload } = actions;
  switch (type) {
    case "PERSONAL_DETAILS":
      return {
        personalDetails: payload,
      };

    default:
      return state;
  }
};
