import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Button from 'react-bootstrap/Button';
import Cookies from "js-cookie";
import Web3ContextProvider, { useWeb3, connectToNetwork } from "web3/context";
import { BrowserRouter } from "react-router-dom";
import { Header } from "components";



ReactDOM.render(

  
  //<React.StrictMode>
    <Web3ContextProvider>
    <BrowserRouter>
    <Header />
      <App />
    </BrowserRouter>
    </Web3ContextProvider>,
  //</React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
