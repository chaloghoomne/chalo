export const calenderDate = (value) => {
  return {
    type: "CALENDER_DATE",
    payload: value,
  };
};

export const returnCalenderDate = (value) => {
  return {
    type: "RETURN_CALENDER_DATE",
    payload: value,
  };
};
