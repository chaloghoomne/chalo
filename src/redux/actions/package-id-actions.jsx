export const PackageId = (value) => {
  return {
    type: "PACKAGE_ID",
    payload: value,
  };
};

export const coTraveler = (value) => {
  return {
    type: "CO_TRAVLER_ID",
    payload: value,
  };
};

export const getVisaType = (value) => {
  return {
    type: "GET_VISA_TYPE",
    payload: value,
  };
};

export const searchPackageByValue = (value) => {
  return {
    type: "SEARCH_PACKAGE",
    payload: value,
  };
};

export const getselectedCountry = (value) => {
  return {
    type: "SELECTED_COUNTRY",
    payload: value,
  };
};

export const getCountryId = (value) => {
  return {
    type: "COUNTRY_ID",
    payload: value,
  };
};

export const setVisaId = (value) => {
  return {
    type: "VISA_ID",
    payload: value,
  };
};

export const setChildShowId = (value) => {
  return {
    type: "CHILD_SHOW_ID",
    payload: value,
  };
};

export const showButton = (value) => {
  return {
    type: "SHOW_BUTTON",
    payload: value,
  };
};