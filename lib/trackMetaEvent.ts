"use client";

type TrackMetaEventOptions = {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  sendPixel?: boolean;
  userData?: {
    email?: string;
    phone?: string;
    fbc?: string;
    fbp?: string;
    external_id?: string;
  };
  customData?: Record<string, any>;
};

export function trackMetaEvent(opts: TrackMetaEventOptions) {
  const eventId = opts.eventId ?? crypto.randomUUID();
  const shouldSendPixel = opts.sendPixel ?? true;

  if (shouldSendPixel && typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", opts.eventName, {
      ...opts.customData,
      event_id: eventId,
    });
  }

  fetch("/api/meta-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName: opts.eventName,
      eventId,
      eventSourceUrl: opts.eventSourceUrl ?? (typeof window !== "undefined" ? window.location.href : undefined),
      userData: {
        em: opts.userData?.email,
        ph: opts.userData?.phone,
        fbc: opts.userData?.fbc,
        fbp: opts.userData?.fbp,
        external_id: opts.userData?.external_id,
      },
      customData: opts.customData,
    }),
  }).catch(() => {});
}
