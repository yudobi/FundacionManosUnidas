import { useTranslation } from "react-i18next";
import { useTestimonials } from "../hooks/queries";

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const { data: testimonials = [], isLoading, isError } = useTestimonials();

  return (
    <section className="section testimonials-section" id="testimonios">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow red">
              {t("testimonialsSection.eyebrow")}
            </span>
            <h2 style={{ marginTop: 20 }}>
              {t("testimonialsSection.titleLine1")}{" "}
              <em>{t("testimonialsSection.titleVoces")}</em>
              <br />
              {t("testimonialsSection.titleLine2")}
            </h2>
          </div>
          <p className="head-lead">{t("testimonialsSection.lead")}</p>
        </div>

        {isError && (
          <p className="head-lead" style={{ color: "var(--red)" }}>
            {t("testimonialsSection.loadError")}
          </p>
        )}

        <div className="testimonial-grid" aria-busy={isLoading}>
          {isLoading
            ? [0, 1].map((i) => (
                <article
                  key={i}
                  className="testimonial"
                  style={{ opacity: 0.55 }}
                >
                  <span className="quote-mark">&ldquo;</span>
                  <blockquote>{t("testimonialsSection.loading")}</blockquote>
                </article>
              ))
            : testimonials.map((tt) => (
                <article
                  key={tt.id}
                  className={`testimonial ${
                    tt.accent === "red" ? "t-red" : "t-blue"
                  }`}
                >
                  <span className="quote-mark">&ldquo;</span>
                  <blockquote>
                    {t(`${tt.id}.quote`, { ns: "testimonials" })}
                  </blockquote>
                  <div className="author">
                    <div className="avatar">{tt.initials}</div>
                    <div className="author-meta">
                      <strong>
                        {t(`${tt.id}.name`, { ns: "testimonials" })}
                      </strong>
                      <small>
                        {t(`${tt.id}.role`, { ns: "testimonials" })}
                      </small>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
