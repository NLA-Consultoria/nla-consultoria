import crypto from "crypto";

const META_API_VERSION = "v24.0";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID;
const META_PIXEL_ACCESS_TOKEN = process.env.META_PIXEL_ACCESS_TOKEN;
const META_PIXEL_TEST_EVENT_CODE = process.env.META_PIXEL_TEST_EVENT_CODE;

export type MetaUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  em?: string; // Email (hashed SHA256)
  ph?: string; // Phone (hashed SHA256)
  fn?: string; // First Name (hashed SHA256)
  ln?: string; // Last Name (hashed SHA256)
  ct?: string; // City (hashed SHA256)
  st?: string; // State (hashed SHA256)
  country?: string; // Country code (hashed SHA256, 2-letter ISO)
  fbc?: string; // Facebook Click ID (from cookie _fbc)
  fbp?: string; // Facebook Browser ID (from cookie _fbp)
  external_id?: string; // External user ID (hashed SHA256)
};

export type MetaCustomData = {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_type?: string;
  [key: string]: any;
};

export interface SendMetaEventParams {
  eventName: string;
  eventId?: string;
  eventTime?: number;
  eventSourceUrl?: string;
  actionSource?: "website";
  userData?: MetaUserData;
  customData?: MetaCustomData;
  testEventCode?: string;
}

export async function sendMetaEvent(params: SendMetaEventParams): Promise<boolean> {
  if (!META_PIXEL_ID || !META_PIXEL_ACCESS_TOKEN) {
    console.error("[Meta CAPI] Missing PIXEL_ID or ACCESS_TOKEN");
    return false;
  }

  const event_time = params.eventTime ?? Math.floor(Date.now() / 1000);
  const event_id = params.eventId ?? crypto.randomUUID();
  const body = {
    data: [
      {
        event_name: params.eventName,
        event_time,
        event_id,
        action_source: params.actionSource ?? "website",
        event_source_url: params.eventSourceUrl,
        user_data: params.userData,
        custom_data: params.customData,
      },
    ],
    test_event_code: params.testEventCode || META_PIXEL_TEST_EVENT_CODE || undefined,
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_PIXEL_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const text = await res.text();
    if (!res.ok) {
      console.error("[Meta CAPI] Error", res.status, text);
      return false;
    } else if (process.env.META_CAPI_DEBUG === "true" || process.env.NODE_ENV !== "production") {
      console.log("[Meta CAPI] OK", text);
    }
    return true;
  } catch (err) {
    console.error("[Meta CAPI] Exception", err);
    return false;
  }
}
