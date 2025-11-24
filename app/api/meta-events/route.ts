import crypto from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { sendMetaEvent, type MetaCustomData, type MetaUserData } from "../../../lib/meta-conversions";

type IncomingEventPayload = {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  userData?: {
    em?: string;
    ph?: string;
    fbc?: string;
    fbp?: string;
    external_id?: string;
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

  if (payload.userData?.em) {
    userData.em = sha256(normalizeEmail(payload.userData.em));
  }

  if (payload.userData?.ph) {
    const normalized = normalizePhone(payload.userData.ph);
    if (normalized) userData.ph = sha256(normalized);
  }

  await sendMetaEvent({
    eventName: payload.eventName,
    eventId: payload.eventId,
    eventSourceUrl: payload.eventSourceUrl,
    actionSource: "website",
    userData,
    customData: payload.customData,
  });

  return NextResponse.json({ success: true });
}
