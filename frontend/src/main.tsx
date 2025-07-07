import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import App from "./App"
import WhyItMatters from "./pages/WhyItMatters"
import Headers from "./components/Header"
import "./index.css"
import Footer from "./components/Footer"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Headers />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/why-it-matters" element={<WhyItMatters />} />{" "}
      </Routes>
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
)
