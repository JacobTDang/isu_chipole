import type { BagItem, Fulfillment, MealTypeId, Order, PickupLocation, PlanSize, Selection, User } from "../data/types";

export const KEYS = {
  user: "preppal.user",
  bag: "preppal.bag",
  orders: "preppal.orders",
  saved: "preppal.saved",
} as const;

export const LEGACY_KEYS = {
  user: "andrews.user",
  bag: "andrews.bag",
  orders: "andrews.orders",
  saved: "andrews.saved",
} as const;

type BagState = { items: BagItem[]; plan: PlanSize; promo?: string };
type RecordValue = Record<string, unknown>;

const isObject = (value: unknown): value is RecordValue => typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const mealTypes: MealTypeId[] = ["bowl", "wrap", "pasta", "salad", "breakfast"];

function isSelection(value: unknown): value is Selection {
  return isObject(value)
    && mealTypes.includes(value.mealType as MealTypeId)
    && Array.isArray(value.ingredientIds) && value.ingredientIds.every(isString)
    && Number.isInteger(value.quantity) && (value.quantity as number) >= 1
    && (value.name === undefined || isString(value.name))
    && (value.presetId === undefined || isString(value.presetId));
}

function selectionReason(value: unknown): string {
  if (!isObject(value)) return "item must be an object";
  if (!mealTypes.includes(value.mealType as MealTypeId)) return "mealType is invalid";
  if (!Array.isArray(value.ingredientIds) || !value.ingredientIds.every(isString)) return "ingredientIds is invalid";
  if (!Number.isInteger(value.quantity) || (value.quantity as number) < 1) return "quantity is invalid";
  if (value.name !== undefined && !isString(value.name)) return "name is invalid";
  if (value.presetId !== undefined && !isString(value.presetId)) return "presetId is invalid";
  return "selection is invalid";
}

const isBagItem = (value: unknown): value is BagItem => isSelection(value) && isString((value as RecordValue).id);
const isPlan = (value: unknown): value is PlanSize => value === 5 || value === 7 || value === 10;
const isLocation = (value: unknown): value is PickupLocation => isObject(value) && isString(value.id) && isString(value.name) && isString(value.note);
const isUser = (value: unknown): value is User => isObject(value) && isString(value.email) && isString(value.firstName);

const isFulfillment = (value: unknown): value is Fulfillment => value === "pickup" || value === "delivery";

function isOrder(value: unknown): value is Order {
  return isObject(value) && isString(value.id) && Array.isArray(value.items) && value.items.every(isBagItem)
    && isPlan(value.plan) && (value.promo === undefined || isString(value.promo)) && isLocation(value.location)
    && isFulfillment(value.fulfillment) && isNumber(value.deliveryFee)
    && (value.fulfillment === "delivery" ? isString(value.address) && value.address.length > 0 : value.address === null)
    && (value.day === "Sunday" || value.day === "Wednesday") && isString(value.time)
    && isNumber(value.subtotal) && isNumber(value.discount) && isNumber(value.tax) && isNumber(value.total)
    && isString(value.placedAt);
}

function migrateOrder(value: unknown): unknown {
  if (!isObject(value) || value.fulfillment !== undefined || value.address !== undefined || value.deliveryFee !== undefined) return value;
  return { ...value, fulfillment: "pickup", address: null, deliveryFee: 0 };
}

function invalid(key: string, reason: string): never {
  throw new Error(`preppal storage: ${key} is invalid: ${reason}`);
}

function parse(key: string, legacyKey?: string): unknown | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key) ?? (legacyKey ? window.localStorage.getItem(legacyKey) : null);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return invalid(key, "not valid JSON");
  }
}

function write(key: string, value: unknown | null): void {
  if (typeof window === "undefined") return;
  if (value === null) window.localStorage.removeItem(key);
  else window.localStorage.setItem(key, JSON.stringify(value));
}

export function readUser(): User | null {
  const value = parse(KEYS.user, LEGACY_KEYS.user);
  if (value === null) return null;
  if (!isUser(value)) return invalid(KEYS.user, "user shape is invalid");
  return value;
}

export function writeUser(user: User | null): void { write(KEYS.user, user); }

export function readOrders(): Order[] {
  const value = parse(KEYS.orders, LEGACY_KEYS.orders);
  if (value === null) return [];
  if (!Array.isArray(value)) return invalid(KEYS.orders, "orders shape is invalid");
  const orders = value.map(migrateOrder);
  if (!orders.every(isOrder)) return invalid(KEYS.orders, "orders shape is invalid");
  return orders;
}

export function writeOrders(orders: Order[]): void { write(KEYS.orders, orders); }

export function readSaved(): Selection[] {
  const value = parse(KEYS.saved, LEGACY_KEYS.saved);
  if (value === null) return [];
  if (!Array.isArray(value) || !value.every(isSelection)) return invalid(KEYS.saved, "saved meals shape is invalid");
  return value;
}

export function writeSaved(saved: Selection[]): void { write(KEYS.saved, saved); }

export function readBagState(): BagState {
  const value = parse(KEYS.bag, LEGACY_KEYS.bag);
  if (value === null) return { items: [], plan: 5 };
  if (!isObject(value)) return invalid(KEYS.bag, "bag state must be an object");
  if (!Array.isArray(value.items)) return invalid(KEYS.bag, "items must be an array");
  const bad = value.items.find((item) => !isBagItem(item));
  if (bad !== undefined) return invalid(KEYS.bag, isSelection(bad) ? "id is invalid" : selectionReason(bad));
  if (!isPlan(value.plan)) return invalid(KEYS.bag, "plan is invalid");
  if (value.promo !== undefined && !isString(value.promo)) return invalid(KEYS.bag, "promo is invalid");
  return value as BagState;
}

export function writeBagState(state: BagState): void { write(KEYS.bag, state); }

export function clearAll(): void {
  if (typeof window === "undefined") return;
  for (const key of Object.values(KEYS)) window.localStorage.removeItem(key);
  for (const key of Object.values(LEGACY_KEYS)) window.localStorage.removeItem(key);
  window.localStorage.removeItem("preppal.prefs");
  window.localStorage.removeItem("andrews.prefs");
}
