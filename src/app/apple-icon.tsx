import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#28152f",
          color: "white",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 78,
        }}
      >
        <div style={{ display: "flex", width: 150, height: 150, borderRadius: 999, border: "5px solid #c5a8ff", alignItems: "center", justifyContent: "center" }}>UM</div>
      </div>
    ),
    size,
  );
}
