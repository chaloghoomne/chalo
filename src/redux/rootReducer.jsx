import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import { LoginReducer } from "./reducers/login-reducer";
import { CalenderReducer } from "./reducers/calender-date-reducer";
import {
  CotravelerIdReducer,
  CountryIdReducer,
  GetVisaTypeReducer,
  PackageIdReducer,
  SearchPackageReducer,
  SelectedCountryReducer,
} from "./reducers/package-id-reducer";
import { PersonalDetailsReducer } from "./reducers/personal-details-reducer";
import { NumberOfTravelerReducer } from "./reducers/numberofTraveler-reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "PackageIdReducer",
    "CotravelerIdReducer",
    "GetVisaTypeReducer",
    "SelectedCountryReducer",
    "NumberOfTravelerReducer",
    "CountryIdReducer",
  ], // only ImageCollectReducer will be persisted
};

const rootReducer = combineReducers({
  LoginReducer,
  CalenderReducer,
  PackageIdReducer,
  CotravelerIdReducer,
  PersonalDetailsReducer,
  NumberOfTravelerReducer,
  GetVisaTypeReducer,
  SearchPackageReducer,
  SelectedCountryReducer,
  CountryIdReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
