import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { bank as bankDefaults } from "../data/bank";
import { formatMXN } from "../lib/formatMXN";
import { useDonationMutation } from "../hooks/queries";
import { useSiteContent } from "../hooks/publicContent";

interface BankValue {
  bank: string;
  beneficiary: string;
  account: string;
  clabe: string;
  rfc: string;
  email: string;
}

const AMOUNTS = [200, 500, 1000, 2500, 5000];
const FREQS = ["Una vez", "Mensual", "Anual"] as const;
type Freq = (typeof FREQS)[number];

const DESTINO_KEYS = [
  "general",
  "techoHernandez",
  "bancosTehuacan",
  "aulaTlaxcalancingo",
] as const;
type DestinoKey = (typeof DESTINO_KEYS)[number];

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export default function DonateSection() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number>(500);
  const [freq, setFreq] = useState<Freq>("Una vez");
  const [destino, setDestino] = useState<DestinoKey>("general");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 260);
    return () => clearTimeout(t);
  }, [amount]);

  const donation = useDonationMutation();
  const bankRemote = useSiteContent<BankValue>("bank");
  const bank: BankValue = {
    bank: bankRemote.pick("bank", bankDefaults.bank),
    beneficiary: bankRemote.pick("beneficiary", bankDefaults.beneficiary),
    account: bankRemote.pick("account", bankDefaults.account),
    clabe: bankRemote.pick("clabe", bankDefaults.clabe),
    rfc: bankRemote.pick("rfc", bankDefaults.rfc),
    email: bankRemote.pick("email", bankDefaults.email),
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    donation.mutate({
      amount,
      frequency: freq,
      destino: t(`donate.destinos.${destino}`),
    });
  }

  const destinoLabel = t(`donate.destinos.${destino}`);

  return (
    <section className="donate-section" id="donar">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t("donate.eyebrow")}</span>
            <h2 style={{ marginTop: 20, color: "#fff" }}>
              {t("donate.titleLine1")}
              <br />
              {t("donate.titleLine2")}{" "}
              <em style={{ color: "#FCA5A5", fontStyle: "italic" }}>
                {t("donate.titleDestino")}
              </em>{" "}
              {t("donate.titleLine3")}
            </h2>
          </div>
          <p className="head-lead">{t("donate.lead")}</p>
        </div>

        <div className="donate-grid">
          <form className="donate-form" onSubmit={handleSubmit}>
            <div className="donate-form-section">
              <div className="block-head">{t("donate.step1")}</div>
              <div className="amount-row">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={amount === a ? "active" : ""}
                    onClick={() => setAmount(a)}
                  >
                    {formatMXN(a)}
                  </button>
                ))}
              </div>
              <div className="amount-custom">
                <span className="currency">MXN $</span>
                <input
                  type="number"
                  placeholder={t("donate.amountOther")}
                  value={amount}
                  min={50}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                />
              </div>

              <div className="block-head" style={{ marginTop: 24 }}>
                {t("donate.step2")}
              </div>
              <div className="freq-row">
                {FREQS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={freq === f ? "active" : ""}
                    onClick={() => setFreq(f)}
                  >
                    {t(`donate.freq.${f}`)}
                  </button>
                ))}
              </div>

              <div className="block-head" style={{ marginTop: 24 }}>
                {t("donate.step3")}
              </div>
              <div className="field">
                <select
                  value={destino}
                  onChange={(e) => setDestino(e.target.value as DestinoKey)}
                >
                  {DESTINO_KEYS.map((d) => (
                    <option key={d} value={d}>
                      {t(`donate.destinos.${d}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="donate-form-section">
              <div className="block-head">{t("donate.step4")}</div>
              <div className="field-row">
                <div className="field">
                  <label>{t("donate.donorName")}</label>
                  <input type="text" placeholder={t("donate.donorNamePh")} />
                </div>
                <div className="field">
                  <label>{t("donate.donorLastName")}</label>
                  <input
                    type="text"
                    placeholder={t("donate.donorLastNamePh")}
                  />
                </div>
              </div>
              <div className="field">
                <label>{t("donate.donorEmail")}</label>
                <input type="email" placeholder={t("donate.donorEmailPh")} />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t("donate.donorRfc")}</label>
                  <input type="text" placeholder="XAXX010101000" />
                </div>
                <div className="field">
                  <label>{t("donate.donorPhone")}</label>
                  <input type="tel" placeholder={t("donate.donorPhonePh")} />
                </div>
              </div>
            </div>

            <div className="donate-form-section">
              <div className="block-head">{t("donate.step5")}</div>
              <div className="field">
                <label>{t("donate.cardNumber")}</label>
                <input type="text" placeholder="•••• •••• •••• ••••" />
              </div>
              <div className="field-row three">
                <div className="field">
                  <label>{t("donate.cardHolder")}</label>
                  <input type="text" placeholder={t("donate.cardHolderPh")} />
                </div>
                <div className="field">
                  <label>{t("donate.cardExpires")}</label>
                  <input type="text" placeholder="MM / AA" />
                </div>
                <div className="field">
                  <label>{t("donate.cardCvc")}</label>
                  <input type="text" placeholder="•••" />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-red btn-lg btn-block"
                style={{ marginTop: 18 }}
                disabled={donation.isPending}
              >
                {donation.isPending
                  ? t("donate.submitting")
                  : t("donate.submit", { amount: formatMXN(amount) })}
              </button>

              {donation.isSuccess && (
                <p
                  style={{
                    marginTop: 14,
                    color: "var(--green-soft)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {t("donate.success", { id: donation.data?.id ?? "" })}
                </p>
              )}
              {donation.isError && (
                <p
                  style={{
                    marginTop: 14,
                    color: "#FCA5A5",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                >
                  {t("donate.error")}
                </p>
              )}
            </div>
          </form>

          <aside className="donate-summary">
            <div className="sum-head">{t("donate.summary")}</div>
            <div className="sum-row">
              <span>{t("donate.summaryProject")}</span>
              <span>{destinoLabel.split("(")[0].trim()}</span>
            </div>
            <div className="sum-row">
              <span>{t("donate.summaryFreq")}</span>
              <span>{t(`donate.freq.${freq}`)}</span>
            </div>
            <div className="sum-row">
              <span>{t("donate.summaryReceipt")}</span>
              <span>{t("donate.summaryReceiptValue")}</span>
            </div>
            <div className="sum-row total">
              <span>{t("donate.summaryTotal")}</span>
              <div
                className="big"
                aria-live="polite"
                style={{
                  color: pulse ? "var(--red-dark)" : undefined,
                  transform: pulse ? "scale(1.02)" : "scale(1)",
                  transition:
                    "transform 220ms cubic-bezier(.2,.7,.3,1), color 220ms ease",
                }}
              >
                {formatMXN(amount)} <small>MXN</small>
              </div>
            </div>

            <div className="lock-note">
              <LockIcon />
              <span
                dangerouslySetInnerHTML={{ __html: t("donate.lockNote") }}
              />
            </div>

            <div className="pay-methods">
              <span className="pay-mark visa">VISA</span>
              <span className="pay-mark mc">●● MC</span>
              <span className="pay-mark amex">AMEX</span>
              <span className="pay-mark oxxo">OXXO</span>
              <span className="pay-mark spei">SPEI</span>
              <span className="pay-mark paypal">PayPal</span>
            </div>
          </aside>
        </div>

        <div className="bank-card">
          <div
            className="bank-cell"
            style={{
              gridColumn: "1 / -1",
              paddingBottom: 14,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              marginBottom: 6,
            }}
          >
            <div
              className="k"
              style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}
            >
              {t("donate.bankTitle")}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                color: "#fff",
                letterSpacing: "-0.015em",
                marginTop: 4,
              }}
            >
              {t("donate.bankSubtitle")}
            </div>
          </div>
          <div className="bank-cell">
            <span className="k">{t("donate.bankFields.bank")}</span>
            <span className="v">{bank.bank}</span>
          </div>
          <div className="bank-cell">
            <span className="k">{t("donate.bankFields.beneficiary")}</span>
            <span className="v">{bank.beneficiary}</span>
          </div>
          <div className="bank-cell">
            <span className="k">{t("donate.bankFields.account")}</span>
            <span className="v">{bank.account}</span>
          </div>
          <div className="bank-cell">
            <span className="k">{t("donate.bankFields.clabe")}</span>
            <span className="v">{bank.clabe}</span>
          </div>
          <div className="bank-cell">
            <span className="k">{t("donate.bankFields.rfc")}</span>
            <span className="v">{bank.rfc}</span>
          </div>
          <div className="bank-cell">
            <span className="k">{t("donate.bankFields.email")}</span>
            <span className="v">{bank.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
