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

export const ReturnCalenderReducer = (state = { returnDate: "" }, actions) => {
  const { type, payload } = actions;
  switch (type) {
    case "RETURN_CALENDER_DATE":
      return {
        returnDate: payload,
      };

    default:
      return state;
  }
};
