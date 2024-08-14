export const PackageIdReducer = (state = { packagedId: null }, actions) => {
  const { type, payload } = actions;
  switch (type) {
    case "PACKAGE_ID":
      return {
        packagedId: payload,
      };

    default:
      return state;
  }
};

export const CotravelerIdReducer = (state = { cotravlerId: null }, actions) => {
  const { type, payload } = actions;
  switch (type) {
    case "CO_TRAVLER_ID":
      return {
        cotravlerId: payload,
      };

    default:
      return state;
  }
};

export const GetVisaTypeReducer = (state = { visaType: null }, actions) => {
  const { type, payload } = actions;
  switch (type) {
    case "GET_VISA_TYPE":
      return {
        visaType: payload,
      };

    default:
      return state;
  }
};

export const SearchPackageReducer = (state = { inputValue: "" }, actions) => {
  const { type, payload } = actions;
  switch (type) {
    case "SEARCH_PACKAGE":
      return {
        inputValue: payload,
      };

    default:
      return state;
  }
};

export const SelectedCountryReducer = (
  state = { selectedCountry: "" },
  actions
) => {
  const { type, payload } = actions;
  switch (type) {
    case "SELECTED_COUNTRY":
      return {
        selectedCountry: payload,
      };

    default:
      return state;
  }
};

export const CountryIdReducer = (state = { countryId: "" }, actions) => {
  const { type, payload } = actions;
  switch (type) {
    case "COUNTRY_ID":
      return {
        countryId: payload,
      };

    default:
      return state;
  }
};
