import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d1117, #161b22)",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            color: "#22d3ee",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          RK
        </div>
      </div>
    ),
    { ...size }
  );
}
