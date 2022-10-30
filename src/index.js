import React from "react";
import ReactDOM from "react-dom/";
import "./index.css";
import App from "./components/develop";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    rootElement
);
