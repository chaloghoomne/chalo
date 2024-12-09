import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { persistStore } from "redux-persist";
import { persistedReducer } from "../src/redux/rootReducer.jsx";
import { applyMiddleware } from "redux";
import { PersistGate } from "redux-persist/integration/react";
import { thunk } from "redux-thunk";
import logger from "redux-logger";

const store = createStore(persistedReducer, applyMiddleware(thunk, logger));
const persistor = persistStore(store);

//remove all consoles
window.console.log = () => {};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
