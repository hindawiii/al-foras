import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Permanent dark mode — enforce on boot before React mounts.
document.documentElement.classList.add("dark");
document.documentElement.classList.remove("light");

createRoot(document.getElementById("root")!).render(<App />);
