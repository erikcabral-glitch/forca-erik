import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./estilo.css";

const raiz = document.getElementById("root");
if (!raiz) throw new Error("Elemento raiz ausente.");
createRoot(raiz).render(<App />);
