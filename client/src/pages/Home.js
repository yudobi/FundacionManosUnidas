import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import Hero from "../components/Hero";
import ResultsBanner from "../components/ResultsBanner";
import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import DonateSection from "../components/DonateSection";
import RegisterSection from "../components/RegisterSection";
import ContactSection from "../components/ContactSection";
import SiteFooter from "../components/SiteFooter";
export default function Home() {
    const location = useLocation();
    // Si llegamos a /#proyectos (o cualquier hash), hacer scroll al ancla.
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.slice(1);
            const el = document.getElementById(id);
            if (el) {
                // Esperar un tick para que el render termine.
                requestAnimationFrame(() => {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                });
            }
        }
    }, [location.hash]);
    return (_jsxs(_Fragment, { children: [_jsx(SiteHeader, {}), _jsxs("main", { id: "main", children: [_jsx(Hero, {}), _jsx(ResultsBanner, {}), _jsx(AboutSection, {}), _jsx(ProjectsSection, {}), _jsx(TestimonialsSection, {}), _jsx(DonateSection, {}), _jsx(RegisterSection, {}), _jsx(ContactSection, {})] }), _jsx(SiteFooter, {})] }));
}
