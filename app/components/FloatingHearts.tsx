"use client";

import { useMemo } from "react";

type Heart = {
  id: string;
  x: number;
  delay: number;
  dur: number;
  size: number;
  glyph: string;
};

const GLYPHS = ["💗", "💖", "💘", "💕", "💝"];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function FloatingHearts({
  count = 14,
  seed = 14,
}: {
  count?: number;
  seed?: number;
}) {
  const hearts = useMemo<Heart[]>(() => {
    const rnd = mulberry32(seed);
    const items: Heart[] = [];
    for (let i = 0; i < count; i += 1) {
      const x = Math.round(rnd() * 1000) / 10; // 0..100%
      const delay = Math.round(rnd() * 900) / 100; // 0..9s
      const dur = 8 + rnd() * 7; // 8..15s
      const size = 16 + rnd() * 18; // 16..34px
      const glyph = GLYPHS[Math.floor(rnd() * GLYPHS.length)];
      items.push({
        id: `${seed}-${i}`,
        x,
        delay,
        dur,
        size,
        glyph,
      });
    }
    return items;
  }, [count, seed]);

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={
            {
              "--x": `${h.x}%`,
              "--delay": `${h.delay}s`,
              "--dur": `${h.dur}s`,
              "--fs": `${h.size}px`,
              "--s": `${0.9 + (h.size - 16) / 60}`,
            } as React.CSSProperties
          }
        >
          {h.glyph}
        </span>
      ))}
    </div>
  );
}

