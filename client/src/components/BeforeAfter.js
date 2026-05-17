import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { beforeAfterImages } from "../data/projects";
export default function BeforeAfter() {
    const { t } = useTranslation();
    const ref = useRef(null);
    const [pct, setPct] = useState(50);
    const draggingRef = useRef(false);
    useEffect(() => {
        function setFromClientX(clientX) {
            const el = ref.current;
            if (!el)
                return;
            const rect = el.getBoundingClientRect();
            const x = clientX - rect.left;
            const p = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setPct(p);
        }
        function onMove(e) {
            if (!draggingRef.current)
                return;
            setFromClientX(e.clientX);
        }
        function onUp() {
            draggingRef.current = false;
        }
        function onTouchMove(e) {
            if (!draggingRef.current)
                return;
            const t = e.touches[0];
            if (t)
                setFromClientX(t.clientX);
        }
        function onTouchEnd() {
            draggingRef.current = false;
        }
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, []);
    function startDrag(clientX) {
        draggingRef.current = true;
        const el = ref.current;
        if (!el)
            return;
        const rect = el.getBoundingClientRect();
        const x = clientX - rect.left;
        setPct(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    }
    function handleKey(e) {
        const step = e.shiftKey ? 10 : 2;
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            setPct((p) => Math.max(0, p - step));
        }
        else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            setPct((p) => Math.min(100, p + step));
        }
        else if (e.key === "Home") {
            e.preventDefault();
            setPct(0);
        }
        else if (e.key === "End") {
            e.preventDefault();
            setPct(100);
        }
    }
    return (_jsxs("div", { className: "beforeafter", ref: ref, style: { ["--ba"]: `${pct}%` }, role: "slider", "aria-label": t("beforeAfter.ariaLabel"), "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(pct), "aria-valuetext": t("beforeAfter.valueText", { value: Math.round(pct) }), tabIndex: 0, onMouseDown: (e) => startDrag(e.clientX), onTouchStart: (e) => {
            const t = e.touches[0];
            if (t)
                startDrag(t.clientX);
        }, onKeyDown: handleKey, children: [_jsxs("div", { className: "ba-side photo tint-red", style: {
                    backgroundImage: `url(${beforeAfterImages.before})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }, children: [_jsx("span", { className: "photo-tag", children: t("beforeAfter.beforeTag") }), _jsx("span", { className: "photo-label", children: t("beforeAfter.beforeLabel") })] }), _jsxs("div", { className: "ba-side ba-after photo tint-blue", style: {
                    backgroundImage: `url(${beforeAfterImages.after})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }, children: [_jsx("span", { className: "photo-tag", style: { left: "auto", right: 16 }, children: t("beforeAfter.afterTag") }), _jsx("span", { className: "photo-label", style: { left: "auto", right: 10 }, children: t("beforeAfter.afterLabel") })] }), _jsx("div", { className: "ba-handle", "aria-hidden": "true" }), _jsx("span", { className: "ba-tag", style: { left: 16 }, children: t("beforeAfter.before") }), _jsx("span", { className: "ba-tag", style: { right: 16 }, children: t("beforeAfter.after") })] }));
}
