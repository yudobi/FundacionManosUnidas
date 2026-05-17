import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import ProtectedRoute from "./auth/ProtectedRoute";
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/proyectos/:id", element: _jsx(ProjectDetail, {}) }), _jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }), _jsxs(Route, { path: "/admin", element: _jsx(ProtectedRoute, { requireAdmin: true, children: _jsx(AdminLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "proyectos", element: _jsx(AdminPlaceholder, { title: "Gesti\u00F3n de proyectos", description: "Crea, edita y archiva proyectos. Sube im\u00E1genes a la galer\u00EDa antes/despu\u00E9s y actualiza el porcentaje de avance." }) }), _jsx(Route, { path: "testimonios", element: _jsx(AdminPlaceholder, { title: "Moderaci\u00F3n de testimonios", description: "Revisa los testimonios enviados por la comunidad. Aprueba los que aparecer\u00E1n en el sitio o rechaza los que no cumplan." }) }), _jsx(Route, { path: "contenido", element: _jsx(AdminPlaceholder, { title: "Contenido del sitio", description: "Edita los textos de Misi\u00F3n, Visi\u00F3n, Valores, los n\u00FAmeros del banner de Resultados, los datos bancarios SPEI y la informaci\u00F3n de contacto." }) }), _jsx(Route, { path: "usuarios", element: _jsx(AdminPlaceholder, { title: "Usuarios registrados", description: "Lista de donantes, voluntarios, familias beneficiarias y aliados institucionales. Cambia roles o desactiva cuentas." }) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }));
}
