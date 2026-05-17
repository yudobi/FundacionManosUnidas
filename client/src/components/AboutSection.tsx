import { useTranslation } from "react-i18next";
import { useSiteContent } from "../hooks/publicContent";

export default function AboutSection() {
  const { t } = useTranslation();
  const i18nValues = t("about.valuesList", { returnObjects: true }) as string[];
  const mission = useSiteContent<{ body: string }>("mission");
  const vision = useSiteContent<{ body: string }>("vision");
  const valuesRemote = useSiteContent<{ items: string[] }>("values");
  const values = valuesRemote.pickList("items", i18nValues);

  return (
    <section className="section" id="nosotros">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow blue">{t("about.eyebrow")}</span>
            <h2 style={{ marginTop: 20 }}>
              {t("about.titleLine1")} <em>{t("about.titleSostienen")}</em>,
              <br />
              {t("about.titleLine2")}{" "}
              <span className="blue-word">{t("about.titleReciben")}</span>.
            </h2>
          </div>
          <p className="head-lead">{t("about.lead")}</p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="divider-mono">{t("about.mission")}</div>
            <p className="about-body">
              {mission.pick("body", t("about.missionBody"))}
            </p>
          </div>

          <div className="about-card blue">
            <div className="divider-mono">{t("about.vision")}</div>
            <p className="about-body">
              {vision.pick("body", t("about.visionBody"))}
            </p>
          </div>

          <div className="about-card green">
            <div className="divider-mono">{t("about.values")}</div>
            <ul className="values">
              {values.map((v) => (
                <li key={v}>— {v}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
