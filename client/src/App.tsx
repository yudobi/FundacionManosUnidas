import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProjectEdit from "./pages/admin/AdminProjectEdit";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminContent from "./pages/admin/AdminContent";
import AdminUsers from "./pages/admin/AdminUsers";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Sitio público */}
      <Route path="/" element={<Home />} />
      <Route path="/proyectos/:id" element={<ProjectDetail />} />

      {/* Login admin (público) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Panel admin (protegido — requiere role=admin) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="proyectos" element={<AdminProjects />} />
        <Route path="proyectos/nuevo" element={<AdminProjectEdit />} />
        <Route path="proyectos/:slug" element={<AdminProjectEdit />} />
        <Route path="testimonios" element={<AdminTestimonials />} />
        <Route path="contenido" element={<AdminContent />} />
        <Route path="usuarios" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
