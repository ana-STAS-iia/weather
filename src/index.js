import React from "react"
import * as ReactDomClient from 'react-dom/client'
import App from "./App"

export const apiKey = '8fb9ab79852a5fd7cff0f3c9f5410ec8';
export const soilApiKey = '3e4a437f24e52246edde942fe0e48d42';

const app = ReactDomClient.createRoot(document.getElementById("app"))
app.render(<App />)