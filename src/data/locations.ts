import type { PickupLocation } from "./types";

export const LOCATIONS: PickupLocation[] = [
  { id: "memorial-union", name: "Memorial Union", note: "Main Lounge entrance" },
  { id: "state-gym", name: "State Gym", note: "Front desk" },
  { id: "parks-library", name: "Parks Library", note: "South entrance" },
  { id: "frederiksen-court", name: "Frederiksen Court", note: "Community center" },
];

export const PICKUP_DAYS = ["Sunday", "Wednesday"] as const;
export const TIME_SLOTS: string[] = [
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM",
];
