import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRegistrationMutation } from "../hooks/queries";
const ROLE_IDS = ["donante", "voluntario", "familia", "aliado"];
const ROLE_KEYS = [
    { id: "donante", key: "01" },
    { id: "voluntario", key: "02" },
    { id: "familia", key: "03" },
    { id: "aliado", key: "04" },
];
const STATE_IDS = ["puebla", "cdmx", "tlaxcala", "otro"];
export default function RegisterSection() {
    const { t } = useTranslation();
    const [role, setRole] = useState("donante");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const registration = useRegistrationMutation();
    function handleSubmit(e) {
        e.preventDefault();
        registration.mutate({ name, email, role });
    }
    return (_jsx("section", { className: "section register-section", id: "registro", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "register-grid", children: [_jsxs("div", { className: "register-aside", children: [_jsx("span", { className: "eyebrow blue", children: t("register.eyebrow") }), _jsxs("h2", { children: [t("register.titleStart"), " ", _jsx("em", { children: t("register.titleEm") }), " ", t("register.titleEnd")] }), _jsx("p", { style: {
                                    marginTop: 24,
                                    fontSize: 16,
                                    lineHeight: 1.55,
                                    color: "var(--ink-soft)",
                                    maxWidth: 480,
                                }, children: t("register.lead") }), _jsx("div", { className: "role-list", children: ROLE_KEYS.map((r) => (_jsxs("div", { className: `role-card${role === r.id ? " active" : ""}`, onClick: () => setRole(r.id), role: "button", tabIndex: 0, onKeyDown: (e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setRole(r.id);
                                        }
                                    }, children: [_jsxs("div", { className: "role-key", children: [_jsx("span", { children: r.key }), _jsx("span", { children: "\u25CF" })] }), _jsx("h4", { children: t(`register.roles.${r.id}.title`) }), _jsx("p", { children: t(`register.roles.${r.id}.desc`) })] }, r.id))) })] }), _jsxs("form", { className: "register-form", onSubmit: handleSubmit, children: [_jsx("div", { className: "divider-mono", children: t("register.form.title") }), _jsxs("div", { className: "field-row", children: [_jsxs("div", { className: "field", children: [_jsx("label", { children: t("register.form.name") }), _jsx("input", { type: "text", placeholder: t("register.form.namePh"), value: name, onChange: (e) => setName(e.target.value) })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("register.form.lastName") }), _jsx("input", { type: "text", placeholder: t("register.form.lastNamePh") })] })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("register.form.email") }), _jsx("input", { type: "email", placeholder: t("register.form.emailPh"), value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { className: "field-row", children: [_jsxs("div", { className: "field", children: [_jsx("label", { children: t("register.form.state") }), _jsx("select", { defaultValue: "puebla", children: STATE_IDS.map((s) => (_jsx("option", { value: s, children: t(`register.states.${s}`) }, s))) })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("register.form.city") }), _jsx("input", { type: "text", placeholder: t("register.form.cityPh") })] })] }), _jsxs("div", { className: "field-row", children: [_jsxs("div", { className: "field", children: [_jsx("label", { children: t("register.form.password") }), _jsx("input", { type: "password", placeholder: t("register.form.passwordPh") })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("register.form.passwordConfirm") }), _jsx("input", { type: "password", placeholder: t("register.form.passwordConfirmPh") })] })] }), _jsxs("label", { className: "field-check", children: [_jsx("input", { type: "checkbox", defaultChecked: true }), _jsxs("span", { children: [t("register.form.termsBefore"), " ", _jsx("a", { href: "#aviso", children: t("register.form.termsPrivacy") }), " ", t("register.form.termsAnd"), " ", _jsx("a", { href: "#terminos", children: t("register.form.termsTerms") }), t("register.form.termsAfter")] })] }), _jsx("button", { type: "submit", className: "btn btn-red btn-lg btn-block", disabled: registration.isPending, children: registration.isPending
                                    ? t("register.form.submitting")
                                    : t("register.form.submit") }), registration.isSuccess && (_jsx("p", { style: {
                                    marginTop: 14,
                                    color: "var(--green-dark)",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 12,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                }, children: t("register.form.success", {
                                    id: registration.data?.id ?? "",
                                }) })), registration.isError && (_jsx("p", { style: {
                                    marginTop: 14,
                                    color: "var(--red)",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 12,
                                }, children: t("register.form.error") })), _jsxs("p", { className: "signin-note", children: [t("register.form.signInQuestion"), " ", _jsx("a", { href: "#login", children: t("register.form.signInLink") })] })] })] }) }) }));
}
