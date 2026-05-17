export interface Testimonial {
  id: string;
  initials: string;
  accent: "red" | "blue";
}

export const testimonials: Testimonial[] = [
  { id: "ofelia", initials: "OT", accent: "red" },
  { id: "javier", initials: "JO", accent: "blue" },
  { id: "carmen", initials: "CE", accent: "red" },
  { id: "mario", initials: "MH", accent: "blue" },
];
