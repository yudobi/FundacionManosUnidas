import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { beforeAfterImages } from "../data/projects";

export default function BeforeAfter() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const draggingRef = useRef(false);

  useEffect(() => {
    function setFromClientX(clientX: number) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const p = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPct(p);
    }

    function onMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      setFromClientX(e.clientX);
    }
    function onUp() {
      draggingRef.current = false;
    }
    function onTouchMove(e: TouchEvent) {
      if (!draggingRef.current) return;
      const t = e.touches[0];
      if (t) setFromClientX(t.clientX);
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

  function startDrag(clientX: number) {
    draggingRef.current = true;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    setPct(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  }

  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setPct((p) => Math.max(0, p - step));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setPct((p) => Math.min(100, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPct(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPct(100);
    }
  }

  return (
    <div
      className="beforeafter"
      ref={ref}
      style={{ ["--ba" as never]: `${pct}%` } as React.CSSProperties}
      role="slider"
      aria-label={t("beforeAfter.ariaLabel")}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-valuetext={t("beforeAfter.valueText", { value: Math.round(pct) })}
      tabIndex={0}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (t) startDrag(t.clientX);
      }}
      onKeyDown={handleKey}
    >
      <div
        className="ba-side photo tint-red"
        style={{
          backgroundImage: `url(${beforeAfterImages.before})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span className="photo-tag">{t("beforeAfter.beforeTag")}</span>
        <span className="photo-label">{t("beforeAfter.beforeLabel")}</span>
      </div>
      <div
        className="ba-side ba-after photo tint-blue"
        style={{
          backgroundImage: `url(${beforeAfterImages.after})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span className="photo-tag" style={{ left: "auto", right: 16 }}>
          {t("beforeAfter.afterTag")}
        </span>
        <span className="photo-label" style={{ left: "auto", right: 10 }}>
          {t("beforeAfter.afterLabel")}
        </span>
      </div>
      <div className="ba-handle" aria-hidden="true" />
      <span className="ba-tag" style={{ left: 16 }}>
        {t("beforeAfter.before")}
      </span>
      <span className="ba-tag" style={{ right: 16 }}>
        {t("beforeAfter.after")}
      </span>
    </div>
  );
}
