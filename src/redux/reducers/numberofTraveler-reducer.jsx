export const NumberOfTravelerReducer = (
  state = { travlersCount: 1 },
  actions
) => {
  const { type, payload } = actions;
  switch (type) {
    case "NUMBER_OF_TRAVELERS":
      return {
        travlersCount: payload,
      };

    default:
      return state;
  }
};
