import { ImageResponse } from "next/og";

export const alt = "UM Gift Collection — Personalized gifts delivered across Pakistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 85% 15%, #e94f87 0%, rgba(233,79,135,0) 45%), radial-gradient(circle at 10% 95%, #9a72f0 0%, rgba(154,114,240,0) 50%), #1a0d20",
          color: "white",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 999,
              border: "3px solid #c5a8ff",
              background: "#28152f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontStyle: "italic",
              fontWeight: 700,
            }}
          >
            UM
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 38, fontWeight: 700 }}>UM Gift Collection</div>
            <div style={{ fontSize: 20, letterSpacing: 6, color: "#ffb38a", fontFamily: "sans-serif", fontWeight: 700 }}>PERSONALIZED GIFTS</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 980 }}>Every gift tells a story. Make yours personal.</div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.75)", fontFamily: "sans-serif" }}>
            Mugs · Cushions · Frames · Lamps · Name jewellery — delivered across Pakistan
          </div>
        </div>
      </div>
    ),
    size,
  );
}
