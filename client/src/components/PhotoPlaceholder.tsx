import type { CSSProperties, ReactNode } from "react";

type Tint = "red" | "blue" | "none";

interface Props {
  tint?: Tint;
  tag?: ReactNode;
  label?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Si se pasa, renderiza la imagen real encima del placeholder rayado. */
  src?: string;
  alt?: string;
}

export default function PhotoPlaceholder({
  tint = "none",
  tag,
  label,
  className = "",
  style,
  src,
  alt = "",
}: Props) {
  const tintClass =
    tint === "red" ? "tint-red" : tint === "blue" ? "tint-blue" : "";
  return (
    <div className={`photo ${tintClass} ${className}`.trim()} style={style}>
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
          }}
        />
      )}
      {tag !== undefined && <span className="photo-tag">{tag}</span>}
      {label !== undefined && <span className="photo-label">{label}</span>}
    </div>
  );
}
