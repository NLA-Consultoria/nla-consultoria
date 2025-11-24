import crypto from "crypto";

const META_API_VERSION = "v24.0";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID;
const META_PIXEL_ACCESS_TOKEN = process.env.META_PIXEL_ACCESS_TOKEN;
const META_PIXEL_TEST_EVENT_CODE = process.env.META_PIXEL_TEST_EVENT_CODE;

export type MetaUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  em?: string;
  ph?: string;
  fbc?: string;
  fbp?: string;
  external_id?: string;
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

export async function sendMetaEvent(params: SendMetaEventParams): Promise<void> {
  if (!META_PIXEL_ID || !META_PIXEL_ACCESS_TOKEN) return;

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
    if (!res.ok && process.env.NODE_ENV !== "production") {
      console.error("Meta CAPI error", res.status, await res.text());
    } else if (process.env.NODE_ENV !== "production") {
      console.log("Meta CAPI ok", await res.text());
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Meta CAPI exception", err);
    }
  }
}
