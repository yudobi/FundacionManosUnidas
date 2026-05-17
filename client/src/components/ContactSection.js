import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { office } from "../data/bank";
import { useContactMutation } from "../hooks/queries";
const SUBJECT_IDS = [
    "voluntario",
    "alianza",
    "postular",
    "prensa",
    "otro",
];
export default function ContactSection() {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("voluntario");
    const [message, setMessage] = useState("");
    const contact = useContactMutation();
    function handleSubmit(e) {
        e.preventDefault();
        contact.mutate({
            name,
            email,
            subject: t(`contact.subjects.${subject}`),
            message,
        });
    }
    // Office address and hours come from data/bank.ts (Spanish-only). Use i18n
    // versions when available; fall back to the raw data otherwise.
    const officeAddress = t("contact.info.officeAddress", {
        defaultValue: office.address,
    });
    const officeHours = t("contact.info.officeHours", {
        defaultValue: office.hours,
    });
    return (_jsx("section", { className: "section", id: "contacto", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "section-head", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow red", children: t("contact.eyebrow") }), _jsx("h2", { style: { marginTop: 20 }, children: _jsx("em", { children: t("contact.title") }) })] }), _jsx("p", { className: "head-lead", children: t("contact.lead") })] }), _jsxs("div", { className: "contact-grid", children: [_jsxs("div", { className: "contact-info", children: [_jsxs("div", { className: "info-block", children: [_jsx("span", { className: "k", children: t("contact.info.office") }), _jsx("span", { className: "v", style: { whiteSpace: "pre-line" }, children: officeAddress })] }), _jsxs("div", { className: "info-block", children: [_jsx("span", { className: "k", children: t("contact.info.hours") }), _jsx("span", { className: "v", style: { whiteSpace: "pre-line" }, children: officeHours })] }), _jsxs("div", { className: "info-block", children: [_jsx("span", { className: "k", children: t("contact.info.phone") }), _jsx("span", { className: "v mono", children: office.phone })] }), _jsxs("div", { className: "info-block", children: [_jsx("span", { className: "k", children: t("contact.info.email") }), _jsx("span", { className: "v mono", children: office.contactEmail })] }), _jsxs("div", { className: "info-block", children: [_jsx("span", { className: "k", children: t("contact.info.donations") }), _jsx("span", { className: "v mono", children: office.donationsEmail })] }), _jsxs("div", { className: "info-block", children: [_jsx("span", { className: "k", children: t("contact.info.socials") }), _jsxs("div", { className: "contact-socials", style: { marginTop: 8 }, children: [_jsxs("a", { className: "social-pill", href: "#instagram", children: [_jsx("span", { className: "sdot" }), "Instagram"] }), _jsxs("a", { className: "social-pill", href: "#facebook", children: [_jsx("span", { className: "sdot" }), "Facebook"] }), _jsxs("a", { className: "social-pill", href: "#tiktok", children: [_jsx("span", { className: "sdot" }), "TikTok"] }), _jsxs("a", { className: "social-pill", href: "#youtube", children: [_jsx("span", { className: "sdot" }), "YouTube"] })] })] })] }), _jsxs("form", { className: "contact-form", onSubmit: handleSubmit, children: [_jsx("div", { className: "divider-mono", children: t("contact.form.title") }), _jsxs("div", { className: "field-row", children: [_jsxs("div", { className: "field", children: [_jsx("label", { children: t("contact.form.name") }), _jsx("input", { type: "text", placeholder: t("contact.form.namePh"), value: name, onChange: (e) => setName(e.target.value) })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("contact.form.email") }), _jsx("input", { type: "email", placeholder: t("contact.form.emailPh"), value: email, onChange: (e) => setEmail(e.target.value) })] })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("contact.form.subject") }), _jsx("select", { value: subject, onChange: (e) => setSubject(e.target.value), children: SUBJECT_IDS.map((s) => (_jsx("option", { value: s, children: t(`contact.subjects.${s}`) }, s))) })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("contact.form.message") }), _jsx("textarea", { rows: 6, placeholder: t("contact.form.messagePh"), value: message, onChange: (e) => setMessage(e.target.value) })] }), _jsx("button", { type: "submit", className: "btn btn-blue btn-lg btn-block", disabled: contact.isPending, children: contact.isPending
                                        ? t("contact.form.submitting")
                                        : t("contact.form.submit") }), contact.isSuccess && (_jsx("p", { style: {
                                        marginTop: 14,
                                        color: "var(--green-dark)",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 12,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                    }, children: t("contact.form.success") })), contact.isError && (_jsx("p", { style: {
                                        marginTop: 14,
                                        color: "var(--red)",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 12,
                                    }, children: t("contact.form.error") }))] })] })] }) }));
}
