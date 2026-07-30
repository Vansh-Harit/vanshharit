import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const socialImageAlt =
  "Vansh Harit, full-stack developer and AI builder";
export const socialImageSize = {
  width: 1200,
  height: 630,
};
export const socialImageContentType = "image/png";

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 74% 22%, #5227ff 0%, transparent 32%), radial-gradient(circle at 22% 82%, #b497cf 0%, transparent 34%), #03030a",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.22)",
            display: "flex",
            height: 530,
            left: 50,
            position: "absolute",
            top: 50,
            width: 1100,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 990,
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#ff9ffc",
              display: "flex",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 0,
              marginBottom: 24,
            }}
          >
            PORTFOLIO / 2026
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.82)",
              display: "flex",
              fontSize: 38,
              letterSpacing: 0,
              marginTop: 30,
            }}
          >
            Full-Stack Developer &amp; AI Builder
          </div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 24,
              marginTop: 64,
            }}
          >
            <div
              style={{
                background: "#ff9ffc",
                borderRadius: 999,
                display: "flex",
                height: 12,
                marginRight: 14,
                width: 12,
              }}
            />
            vanshharit.vercel.app
          </div>
        </div>
      </div>
    ),
    socialImageSize
  );
}
