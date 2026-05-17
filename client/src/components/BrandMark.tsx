interface Props {
  /** Si true, usa el Logo.jpeg de /public en lugar del monograma SVG. */
  useLogo?: boolean;
  size?: number;
}

export default function BrandMark({ useLogo = true, size = 40 }: Props) {
  if (useLogo) {
    return (
      <img
        src="/Logo.jpeg"
        alt="Fundación Manos Unidas P.E.A.C — logotipo"
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flex: "none",
        }}
      />
    );
  }
  return (
    <div className="brand-mark" aria-hidden="true">
      <span className="b-blue" />
      <span className="b-red" />
    </div>
  );
}
