import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import "./lib/i18n"
import App from "./App.tsx"

// Vite injects BASE_URL (e.g. "/Mighta/" on GitHub Pages, "/" in dev).
// Strip trailing slash for react-router's basename.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
)
