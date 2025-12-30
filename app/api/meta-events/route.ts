import crypto from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { sendMetaEvent, type MetaCustomData, type MetaUserData } from "../../../lib/meta-conversions";

type IncomingEventPayload = {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  userData?: {
    em?: string; // Email (raw, will be hashed)
    ph?: string; // Phone (raw, will be hashed)
    fn?: string; // First Name (raw, will be hashed)
    ln?: string; // Last Name (raw, will be hashed)
    ct?: string; // City (raw, will be hashed)
    st?: string; // State (raw, will be hashed)
    country?: string; // Country code (raw, will be hashed)
    fbc?: string; // Facebook Click ID (not hashed)
    fbp?: string; // Facebook Browser ID (not hashed)
    external_id?: string; // External ID (not hashed)
  };
  customData?: MetaCustomData;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeName(name: string) {
  // Lowercase, remove accents, trim
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
}

function normalizeCity(city: string) {
  // Same as name: lowercase, remove accents
  return city
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeState(state: string) {
  // Lowercase, 2 letters (ex: "SP" → "sp")
  return state.trim().toLowerCase();
}

function normalizeCountry(country: string) {
  // Lowercase, 2-letter ISO code (ex: "BR" → "br")
  return country.trim().toLowerCase();
}

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return req.ip ?? undefined;
}

export async function POST(req: NextRequest) {
  if (req.headers.get("content-type")?.includes("application/json") !== true) {
    return NextResponse.json({ error: "Invalid content-type" }, { status: 400 });
  }

  let payload: IncomingEventPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.eventName) {
    return NextResponse.json({ error: "eventName is required" }, { status: 400 });
  }

  const client_ip_address = getClientIp(req);
  const client_user_agent = req.headers.get("user-agent") || undefined;

  const userData: MetaUserData = {
    client_ip_address,
    client_user_agent,
    fbc: payload.userData?.fbc,
    fbp: payload.userData?.fbp,
    external_id: payload.userData?.external_id,
  };

  // Hash email
  if (payload.userData?.em) {
    userData.em = sha256(normalizeEmail(payload.userData.em));
  }

  // Hash phone
  if (payload.userData?.ph) {
    const normalized = normalizePhone(payload.userData.ph);
    if (normalized) userData.ph = sha256(normalized);
  }

  // Hash first name
  if (payload.userData?.fn) {
    userData.fn = sha256(normalizeName(payload.userData.fn));
  }

  // Hash last name
  if (payload.userData?.ln) {
    userData.ln = sha256(normalizeName(payload.userData.ln));
  }

  // Hash city
  if (payload.userData?.ct) {
    userData.ct = sha256(normalizeCity(payload.userData.ct));
  }

  // Hash state
  if (payload.userData?.st) {
    userData.st = sha256(normalizeState(payload.userData.st));
  }

  // Hash country (default to Brazil if not provided)
  if (payload.userData?.country) {
    userData.country = sha256(normalizeCountry(payload.userData.country));
  } else {
    // Default: Brazil
    userData.country = sha256("br");
  }

  const ok = await sendMetaEvent({
    eventName: payload.eventName,
    eventId: payload.eventId,
    eventSourceUrl: payload.eventSourceUrl,
    actionSource: "website",
    userData,
    customData: payload.customData,
  });

  return NextResponse.json({ success: ok });
}
