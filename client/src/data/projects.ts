export type ProjectStatus = "en-curso" | "realizado" | "emergencia";

export interface Project {
  id: string;
  tag: string;
  status: ProjectStatus;
  goal: number;
  raised: number;
  percent: number;
  tint?: "red" | "blue" | "none";
  year?: string;
  /** Images en /public/Imagenes/converted/ — cover = índice 0 */
  images: string[];
}

function img(n: number): string {
  return `/Imagenes/converted/imagen-${String(n).padStart(2, "0")}.jpg`;
}

function range(start: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) => img(start + i));
}

export const projects: Project[] = [
  {
    id: "techo-hernandez",
    tag: "01",
    status: "en-curso",
    goal: 64000,
    raised: 48200,
    percent: 75,
    tint: "red",
    images: range(1, 6),
  },
  {
    id: "bancos-alimentos-tehuacan",
    tag: "02",
    status: "emergencia",
    goal: 142000,
    raised: 86500,
    percent: 61,
    tint: "blue",
    images: range(27, 6),
  },
  {
    id: "aula-tlaxcalancingo",
    tag: "03",
    status: "en-curso",
    goal: 215000,
    raised: 162400,
    percent: 76,
    tint: "none",
    images: range(53, 6),
  },
  {
    id: "comedor-atlixco",
    tag: "04",
    status: "realizado",
    year: "2024",
    goal: 184500,
    raised: 184500,
    percent: 100,
    tint: "blue",
    images: range(79, 6),
  },
  {
    id: "pozo-tepetzingo",
    tag: "05",
    status: "realizado",
    year: "2024",
    goal: 92000,
    raised: 92000,
    percent: 100,
    tint: "none",
    images: range(105, 6),
  },
  {
    id: "brigada-sierra-negra",
    tag: "06",
    status: "realizado",
    year: "2023",
    goal: 71200,
    raised: 71200,
    percent: 100,
    tint: "red",
    images: range(131, 6),
  },
];

/** Imágenes destacadas para el hero (3 fotos del collage). */
export const heroImages = {
  primary: img(10),
  secondary: img(40),
  tertiary: img(70),
};

/** Antes / después usado en la sección Proyectos. */
export const beforeAfterImages = {
  before: img(82),
  after: img(85),
};
