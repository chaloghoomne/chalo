export const CalenderReducer = (state = { visaDate: "" }, actions) => {
  const { type, payload } = actions;
  switch (type) {
    case "CALENDER_DATE":
      return {
        visaDate: payload,
      };

    default:
      return state;
  }
};
