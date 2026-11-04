import type { FaqItem } from "./types";

export const FAQS: FaqItem[] = [
  {
    id: "ship-1",
    category: "shipping",
    question: "Where does ShopSphere ship?",
    answer:
      "We dispatch from the Islamabad atelier across Pakistan through TCS Express, and to selected Gulf cities on a weekly air note. Complimentary shipping begins at $150.",
  },
  {
    id: "ship-2",
    category: "shipping",
    question: "How fast is a studio order?",
    answer:
      "In-stock pieces leave within two working days. Made-to-measure tailoring is quoted separately and usually takes ten to fourteen days before it is handed to the carrier.",
  },
  {
    id: "ret-1",
    category: "returns",
    question: "What is the return window?",
    answer:
      "Unworn pieces with tags may return within 30 days of delivery. Atelier alterations and pierced jewelry are final. Approved refunds return to your ShopSphere wallet.",
  },
  {
    id: "ret-2",
    category: "returns",
    question: "How do I start a return?",
    answer:
      "Open your receipt or the tracking desk and request a return. The atelier reviews it, then credits the order total to the wallet on the matching client account.",
  },
  {
    id: "size-1",
    category: "sizing",
    question: "How should I choose a size?",
    answer:
      "Garments follow a relaxed European cut. If you sit between sizes, take the larger one for shirts and the smaller one for tailored wool. Shoe sizes on the page are EU. Each piece has a size note.",
  },
  {
    id: "size-2",
    category: "sizing",
    question: "Do you alter purchases?",
    answer:
      "Yes. Hemming and sleeve adjustments are complimentary in Islamabad and Lahore for orders over $150. Book a fitting from the contact desk.",
  },
  {
    id: "pay-1",
    category: "payment",
    question: "Which ways can I pay?",
    answer:
      "Visa and Mastercard, cash on delivery inside Pakistan, JazzCash, EasyPaisa, a direct bank transfer, or your ShopSphere wallet. Loyalty points convert at 100 points to $1, up to 30% of the goods. Card numbers are never stored in full.",
  },
  {
    id: "pay-2",
    category: "payment",
    question: "Which studio codes are live?",
    answer:
      "STUDENT20 takes 20% off, WELCOME10 takes 10% off, and SAVE15 removes $15. The atelier can add further codes from the console. One code per order. Codes apply to merchandise, not to shipping or tax.",
  },
];

export const CLIENTS = [
  { id: "C-1042", name: "Mohsin Gohar", email: "mohsingohar759@gmail.com", phone: "+92 300 1234567", city: "Islamabad", tier: "Gold VIP", status: "VIP" as const },
  { id: "C-1108", name: "Hira Nadeem", email: "hira.nadeem@example.com", phone: "+92 321 5550198", city: "Lahore", tier: "Silver Collector", status: "Active" as const },
  { id: "C-1184", name: "Omar Farooq", email: "omar.farooq@example.com", phone: "+92 333 4412090", city: "Karachi", tier: "Bronze Member", status: "New" as const },
  { id: "C-1210", name: "Leila Hassan", email: "leila.hassan@example.com", phone: "+971 50 882 1140", city: "Dubai", tier: "Atelier Platinum", status: "VIP" as const },
  { id: "C-1266", name: "Bilal Qureshi", email: "bilal.q@example.com", phone: "+92 345 7782104", city: "Rawalpindi", tier: "Silver Collector", status: "Active" as const },
  { id: "C-1302", name: "Sana Irfan", email: "sana.irfan@example.com", phone: "+92 312 9004412", city: "Faisalabad", tier: "Gold VIP", status: "Active" as const },
];

export function sizesFor(category: string) {
  if (category === "Shoes") return ["36", "37", "38", "39", "40", "41", "42", "43"];
  if (category === "Accessories") return ["One size"];
  return ["XS", "S", "M", "L", "XL"];
}

export function colorsFor(category: string) {
  if (category === "Shoes") return ["Black", "White", "Clay"];
  if (category === "Accessories") return ["Gold", "Silver", "Ink"];
  if (category === "Men") return ["Ink", "Stone", "Ivory"];
  return ["Ivory", "Black", "Olive"];
}

export const SIZE_NOTES: Record<string, Array<{ size: string; detail: string }>> = {
  Women: [
    { size: "XS", detail: "Bust 80 · Waist 62" },
    { size: "S", detail: "Bust 84 · Waist 66" },
    { size: "M", detail: "Bust 88 · Waist 70" },
    { size: "L", detail: "Bust 94 · Waist 76" },
    { size: "XL", detail: "Bust 100 · Waist 82" },
  ],
  Men: [
    { size: "XS", detail: "Chest 88 · Waist 74" },
    { size: "S", detail: "Chest 92 · Waist 78" },
    { size: "M", detail: "Chest 98 · Waist 84" },
    { size: "L", detail: "Chest 104 · Waist 90" },
    { size: "XL", detail: "Chest 110 · Waist 96" },
  ],
  Shoes: [
    { size: "39", detail: "EU 39 · UK 6" },
    { size: "40", detail: "EU 40 · UK 6.5" },
    { size: "41", detail: "EU 41 · UK 7.5" },
    { size: "42", detail: "EU 42 · UK 8" },
    { size: "43", detail: "EU 43 · UK 9" },
  ],
  Accessories: [{ size: "One size", detail: "Designed to sit without adjustment." }],
};

const REVIEWERS = ["Amina R.", "Leo Park", "Sara Qureshi", "Daniel Okonkwo", "Noor Ali", "James Whit"];

export function reviewsFor(id: number, rating: number) {
  return [0, 1, 2].map((offset) => ({
    name: REVIEWERS[(id + offset) % REVIEWERS.length],
    rating: Math.max(3, Math.min(5, Math.round(rating - (offset === 2 ? 1 : 0)))),
    title: ["Cut beautifully", "Worth the wait", "Daily uniform"][offset],
    body: [
      "The cloth sits cleanly and the finishing is quiet in the way good clothes should be.",
      "Packed with care, true to the photograph, and easy to wear from morning through dinner.",
      "I have already reached for it twice this week. The proportion is right.",
    ][offset],
  }));
}

export const SEASON = [
  { month: "May", revenue: 42800 },
  { month: "Jun", revenue: 46250 },
  { month: "Jul", revenue: 39120 },
  { month: "Aug", revenue: 51440 },
  { month: "Sep", revenue: 58610 },
  { month: "Oct", revenue: 64280 },
];
