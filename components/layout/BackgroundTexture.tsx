"use client";

import React from "react";

export function BackgroundTexture() {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            repeating-linear-gradient(
              -38deg,
              transparent 0px,
              transparent 18px,
              rgba(0,0,0,0.03) 18px,
              rgba(0,0,0,0.03) 19px,
              transparent 19px,
              transparent 42px
            ),
            repeating-linear-gradient(
              -38deg,
              transparent 0px,
              transparent 74px,
              rgba(0,0,0,0.02) 74px,
              rgba(0,0,0,0.02) 76px,
              transparent 76px,
              transparent 160px
            )
          `,
          maskImage:
            "radial-gradient(ellipse 95% 70% at 20% 10%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 70% at 20% 10%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.18]"
        style={{
          background: `
            radial-gradient(circle at 20% 35%, rgba(180,160,120,0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 15%, rgba(160,140,100,0.12) 0%, transparent 45%),
            radial-gradient(circle at 55% 70%, rgba(200,180,140,0.10) 0%, transparent 40%),
            radial-gradient(circle at 10% 80%, rgba(170,150,110,0.08) 0%, transparent 35%)
          `,
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,248,232,0.55) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 80% 110%, rgba(0,99,146,0.05) 0%, transparent 60%)",
        }}
      />
    </>
  );
}
