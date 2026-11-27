// Plan lists as published on prestigehomeguard.com. Keep in step with the website plan cards.
const BASIC = [
  "Heating Systems & Ducts",
  "Electrical Systems",
  "Plumbing Systems",
  "Plumbing Stoppages",
  "Water Heater",
];

const STANDARD = [
  "Air Conditioning",
  "Heating Systems & Ducts",
  "Electrical Systems",
  "Plumbing Systems",
  "Plumbing Stoppages",
  "Garage Door Opener",
  "Water Heater",
  "Refrigerator",
  "Range / Stove / Oven",
  "Dishwasher",
  "Built-in Microwave",
  "Garbage Disposal",
  "Washer",
  "Dryer",
];

const ULTIMATE = [
  ...STANDARD,
  "Roof Leak Repair",
  "Unlimited AC Refrigerant",
  "HVAC Tune-up",
  "Permits & Modifications",
  "Rekey Service",
  "Whirlpool Bathtub",
];

const PLAN_ITEMS: Record<string, string[]> = {
  basic: BASIC,
  standard: STANDARD,
  ultimate: ULTIMATE,
};

// The plan name exactly as Zoho holds it ("-None-" is Zoho's empty choice).
export function planName(value?: string | null): string {
  const name = value?.trim();
  return name && name !== "-None-" ? name : "N/A";
}

// Items for the customer's plan, or null when the Zoho value is not one of the three plans.
export function planItems(value?: string | null): string[] | null {
  return PLAN_ITEMS[value?.trim().toLowerCase() ?? ""] ?? null;
}
