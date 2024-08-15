import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store/index.js";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";
import axios from "axios";
import "./main.css";

axios.defaults.baseURL = "http://localhost:3001/";
// axios.defaults.baseURL ="https://e-geek-collectibles-production.up.railway.app/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="dev-cwjtorau12scm3w1.us.auth0.com"
    clientId="XJuAgbwbUPAPdeGTdwjxTCpkwHSmixjM"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </Auth0Provider>,
);
