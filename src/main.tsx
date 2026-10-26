import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import { DemoProvider } from "./lib/store";
import Inicio from "./pages/Inicio";
import { MisObras, Lotes } from "./pages/Obras";
import Resumen from "./pages/Resumen";
import Facturas from "./pages/Facturas";
import Carbono from "./pages/Carbono";
import Reporte from "./pages/Reporte";
import Cotizaciones from "./pages/Cotizaciones";
import Vision from "./pages/Vision";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Inicio /> },
      { path: "/obras", element: <MisObras /> },
      { path: "/obras/residencial-demo", element: <Lotes /> },
      { path: "/casa/resumen", element: <Resumen /> },
      { path: "/casa/facturas", element: <Facturas /> },
      { path: "/casa/carbono", element: <Carbono /> },
      { path: "/casa/reporte", element: <Reporte /> },
      { path: "/casa/cotizaciones", element: <Cotizaciones /> },
      { path: "/vision", element: <Vision /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DemoProvider>
      <RouterProvider router={router} />
    </DemoProvider>
  </StrictMode>,
);
