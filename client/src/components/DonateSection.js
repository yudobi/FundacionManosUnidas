import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { bank } from "../data/bank";
import { formatMXN } from "../lib/formatMXN";
import { useDonationMutation } from "../hooks/queries";
const AMOUNTS = [200, 500, 1000, 2500, 5000];
const FREQS = ["Una vez", "Mensual", "Anual"];
const DESTINO_KEYS = [
    "general",
    "techoHernandez",
    "bancosTehuacan",
    "aulaTlaxcalancingo",
];
function LockIcon() {
    return (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [_jsx("rect", { x: "3", y: "7", width: "10", height: "7", rx: "1.5" }), _jsx("path", { d: "M5 7V5a3 3 0 0 1 6 0v2" })] }));
}
export default function DonateSection() {
    const { t } = useTranslation();
    const [amount, setAmount] = useState(500);
    const [freq, setFreq] = useState("Una vez");
    const [destino, setDestino] = useState("general");
    const [pulse, setPulse] = useState(false);
    useEffect(() => {
        setPulse(true);
        const t = setTimeout(() => setPulse(false), 260);
        return () => clearTimeout(t);
    }, [amount]);
    const donation = useDonationMutation();
    function handleSubmit(e) {
        e.preventDefault();
        donation.mutate({
            amount,
            frequency: freq,
            destino: t(`donate.destinos.${destino}`),
        });
    }
    const destinoLabel = t(`donate.destinos.${destino}`);
    return (_jsx("section", { className: "donate-section", id: "donar", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "section-head", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: t("donate.eyebrow") }), _jsxs("h2", { style: { marginTop: 20, color: "#fff" }, children: [t("donate.titleLine1"), _jsx("br", {}), t("donate.titleLine2"), " ", _jsx("em", { style: { color: "#FCA5A5", fontStyle: "italic" }, children: t("donate.titleDestino") }), " ", t("donate.titleLine3")] })] }), _jsx("p", { className: "head-lead", children: t("donate.lead") })] }), _jsxs("div", { className: "donate-grid", children: [_jsxs("form", { className: "donate-form", onSubmit: handleSubmit, children: [_jsxs("div", { className: "donate-form-section", children: [_jsx("div", { className: "block-head", children: t("donate.step1") }), _jsx("div", { className: "amount-row", children: AMOUNTS.map((a) => (_jsx("button", { type: "button", className: amount === a ? "active" : "", onClick: () => setAmount(a), children: formatMXN(a) }, a))) }), _jsxs("div", { className: "amount-custom", children: [_jsx("span", { className: "currency", children: "MXN $" }), _jsx("input", { type: "number", placeholder: t("donate.amountOther"), value: amount, min: 50, onChange: (e) => setAmount(Number(e.target.value) || 0) })] }), _jsx("div", { className: "block-head", style: { marginTop: 24 }, children: t("donate.step2") }), _jsx("div", { className: "freq-row", children: FREQS.map((f) => (_jsx("button", { type: "button", className: freq === f ? "active" : "", onClick: () => setFreq(f), children: t(`donate.freq.${f}`) }, f))) }), _jsx("div", { className: "block-head", style: { marginTop: 24 }, children: t("donate.step3") }), _jsx("div", { className: "field", children: _jsx("select", { value: destino, onChange: (e) => setDestino(e.target.value), children: DESTINO_KEYS.map((d) => (_jsx("option", { value: d, children: t(`donate.destinos.${d}`) }, d))) }) })] }), _jsxs("div", { className: "donate-form-section", children: [_jsx("div", { className: "block-head", children: t("donate.step4") }), _jsxs("div", { className: "field-row", children: [_jsxs("div", { className: "field", children: [_jsx("label", { children: t("donate.donorName") }), _jsx("input", { type: "text", placeholder: t("donate.donorNamePh") })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("donate.donorLastName") }), _jsx("input", { type: "text", placeholder: t("donate.donorLastNamePh") })] })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("donate.donorEmail") }), _jsx("input", { type: "email", placeholder: t("donate.donorEmailPh") })] }), _jsxs("div", { className: "field-row", children: [_jsxs("div", { className: "field", children: [_jsx("label", { children: t("donate.donorRfc") }), _jsx("input", { type: "text", placeholder: "XAXX010101000" })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("donate.donorPhone") }), _jsx("input", { type: "tel", placeholder: t("donate.donorPhonePh") })] })] })] }), _jsxs("div", { className: "donate-form-section", children: [_jsx("div", { className: "block-head", children: t("donate.step5") }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("donate.cardNumber") }), _jsx("input", { type: "text", placeholder: "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022" })] }), _jsxs("div", { className: "field-row three", children: [_jsxs("div", { className: "field", children: [_jsx("label", { children: t("donate.cardHolder") }), _jsx("input", { type: "text", placeholder: t("donate.cardHolderPh") })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("donate.cardExpires") }), _jsx("input", { type: "text", placeholder: "MM / AA" })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: t("donate.cardCvc") }), _jsx("input", { type: "text", placeholder: "\u2022\u2022\u2022" })] })] }), _jsx("button", { type: "submit", className: "btn btn-red btn-lg btn-block", style: { marginTop: 18 }, disabled: donation.isPending, children: donation.isPending
                                                ? t("donate.submitting")
                                                : t("donate.submit", { amount: formatMXN(amount) }) }), donation.isSuccess && (_jsx("p", { style: {
                                                marginTop: 14,
                                                color: "var(--green-soft)",
                                                fontFamily: "var(--font-mono)",
                                                fontSize: 12,
                                                letterSpacing: "0.1em",
                                                textTransform: "uppercase",
                                            }, children: t("donate.success", { id: donation.data?.id ?? "" }) })), donation.isError && (_jsx("p", { style: {
                                                marginTop: 14,
                                                color: "#FCA5A5",
                                                fontFamily: "var(--font-mono)",
                                                fontSize: 12,
                                            }, children: t("donate.error") }))] })] }), _jsxs("aside", { className: "donate-summary", children: [_jsx("div", { className: "sum-head", children: t("donate.summary") }), _jsxs("div", { className: "sum-row", children: [_jsx("span", { children: t("donate.summaryProject") }), _jsx("span", { children: destinoLabel.split("(")[0].trim() })] }), _jsxs("div", { className: "sum-row", children: [_jsx("span", { children: t("donate.summaryFreq") }), _jsx("span", { children: t(`donate.freq.${freq}`) })] }), _jsxs("div", { className: "sum-row", children: [_jsx("span", { children: t("donate.summaryReceipt") }), _jsx("span", { children: t("donate.summaryReceiptValue") })] }), _jsxs("div", { className: "sum-row total", children: [_jsx("span", { children: t("donate.summaryTotal") }), _jsxs("div", { className: "big", "aria-live": "polite", style: {
                                                color: pulse ? "var(--red-dark)" : undefined,
                                                transform: pulse ? "scale(1.02)" : "scale(1)",
                                                transition: "transform 220ms cubic-bezier(.2,.7,.3,1), color 220ms ease",
                                            }, children: [formatMXN(amount), " ", _jsx("small", { children: "MXN" })] })] }), _jsxs("div", { className: "lock-note", children: [_jsx(LockIcon, {}), _jsx("span", { dangerouslySetInnerHTML: { __html: t("donate.lockNote") } })] }), _jsxs("div", { className: "pay-methods", children: [_jsx("span", { className: "pay-mark visa", children: "VISA" }), _jsx("span", { className: "pay-mark mc", children: "\u25CF\u25CF MC" }), _jsx("span", { className: "pay-mark amex", children: "AMEX" }), _jsx("span", { className: "pay-mark oxxo", children: "OXXO" }), _jsx("span", { className: "pay-mark spei", children: "SPEI" }), _jsx("span", { className: "pay-mark paypal", children: "PayPal" })] })] })] }), _jsxs("div", { className: "bank-card", children: [_jsxs("div", { className: "bank-cell", style: {
                                gridColumn: "1 / -1",
                                paddingBottom: 14,
                                borderBottom: "1px solid rgba(255,255,255,0.1)",
                                marginBottom: 6,
                            }, children: [_jsx("div", { className: "k", style: { color: "rgba(255,255,255,0.7)", fontSize: 11 }, children: t("donate.bankTitle") }), _jsx("div", { style: {
                                        fontFamily: "var(--font-display)",
                                        fontSize: 24,
                                        color: "#fff",
                                        letterSpacing: "-0.015em",
                                        marginTop: 4,
                                    }, children: t("donate.bankSubtitle") })] }), _jsxs("div", { className: "bank-cell", children: [_jsx("span", { className: "k", children: t("donate.bankFields.bank") }), _jsx("span", { className: "v", children: bank.bank })] }), _jsxs("div", { className: "bank-cell", children: [_jsx("span", { className: "k", children: t("donate.bankFields.beneficiary") }), _jsx("span", { className: "v", children: bank.beneficiary })] }), _jsxs("div", { className: "bank-cell", children: [_jsx("span", { className: "k", children: t("donate.bankFields.account") }), _jsx("span", { className: "v", children: bank.account })] }), _jsxs("div", { className: "bank-cell", children: [_jsx("span", { className: "k", children: t("donate.bankFields.clabe") }), _jsx("span", { className: "v", children: bank.clabe })] }), _jsxs("div", { className: "bank-cell", children: [_jsx("span", { className: "k", children: t("donate.bankFields.rfc") }), _jsx("span", { className: "v", children: bank.rfc })] }), _jsxs("div", { className: "bank-cell", children: [_jsx("span", { className: "k", children: t("donate.bankFields.email") }), _jsx("span", { className: "v", children: bank.email })] })] })] }) }));
}
