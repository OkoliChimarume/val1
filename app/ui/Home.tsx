"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { LoadingScreen } from "../components/LoadingScreen";
import { FloatingHearts } from "../components/FloatingHearts";

const NO_TEXTS = [
  { text: "No", image: "/image1.jpeg" },
  { text: "Are you sure?", image: "/image2.jpeg" },
  { text: "Like… REALLY sure?", image: "/image3.gif" },
  { text: "Do you have your glasses on? 🤓", image: "/image4.gif" },
  { text: "The YES button is the other one.", image: "/image5.gif" },
  { text: "Oops! Wrong choice. Try again.", image: "/image6.gif" },
  { text: "You're breaking my heart 💔", image: "/image7.jpeg" },
  { text: "Maybe your finger slipped?", image: "/image9.jpeg" },
  { text: "Be honest… you meant YES.", image: "/image10.jpeg" },
  { text: "This is getting suspicious.", image: "/image11.jpeg" },
  { text: "Plot twist: NO is disabled (in my heart).", image: "/image13.gif" },
  { text: "Final answer?", image: "/image12.jpeg" },
  { text: "Last chance… pretty please? 🥺", image: "/image14.jpeg" },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const yesScale = useMemo(() => {
    const s = Math.pow(1.15, noClicks);
    return clamp(s, 1, 6);
  }, [noClicks]);

  const noScale = useMemo(() => {
    // Shrink by 10% per click, minimum 0.3 (30% of original size)
    const s = Math.pow(0.90, noClicks);
    return clamp(s, 0.3, 1);
  }, [noClicks]);

  // Get the current no text and image based on noClicks
  const noItem = NO_TEXTS[Math.min(noClicks, NO_TEXTS.length - 1)];
  const currentImage = noItem.image;
  const noLabel = noItem.text;

  // Collect all images to preload (including yes-image.gif)
  const allImagesToPreload = useMemo(() => {
    const images = NO_TEXTS.map((item) => item.image);
    images.push("/yes-image.gif"); // Add the success image
    return images;
  }, []);

  function handleNoClick() {
    setNoClicks((c) => c + 1);
    setImageKey((k) => k + 1); // Trigger re-animation
  }

  function postAboutit() {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.set(
      "text",
      "I just said YES to being someone's Valentine! 💖 #ValentinesDay"
    );
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      
      <div className="val-bg relative min-h-screen overflow-hidden">
        <FloatingHearts seed={11} />

        <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-5 py-14">
          <div className="val-card relative w-full max-w-3xl md:h-[80vh] rounded-3xl px-4 py-4 backdrop-blur sm:px-6 sm:py-5 flex flex-col">
            <div className="absolute -top-3 left-6 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-700 ring-1 ring-black/5">
              💌 Valentine Proposal
            </div>

            {/* Image display with fade animation */}
            <div className="relative mx-auto aspect-square w-full max-w-70 sm:max-w-[320px] overflow-hidden rounded-2xl flex-shrink-0">
              <Image
                key={imageKey}
                src={currentImage}
                alt="Valentine's proposal"
                fill
                className="image-fade object-cover transition-none"
                priority={imageKey === 0}
                sizes="(max-width: 768px) 280px, 320px"
              />
            </div>

          <div className="mt-6 text-center">
            <h1 className="text-balance font-extrabold tracking-tight text-zinc-900 text-2xl md:text-3xl">
              F***** C****** ********, will you be my valentine?
            </h1>
            <p className="mx-auto mt-3 text-pretty text-base text-zinc-700 max-w-xl">
              I made this tiny website to ask you in the cutest way possible.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <button
              type="button"
              onClick={() => setAccepted(true)}
              className="val-soft-ring items-center justify-center rounded-full bg-pink-500 px-8 py-4 text-lg font-extrabold text-white shadow-lg shadow-pink-500/30 transition-transform duration-200 active:scale-95"
              style={{
                transform: `scale(${yesScale})`,
              }}
              aria-label="Yes"
            >
              YES 💖
            </button>

            <button
              type="button"
              onClick={handleNoClick}
              className="max-w-[20ch] inline-flex items-center justify-center rounded-full bg-white/75 px-7 py-3.5 text-base font-bold text-zinc-900 ring-1 ring-black/10 backdrop-blur transition-all duration-200 hover:bg-white active:scale-95"
              style={{
                transform: `scale(${noScale})`,
              }}
              aria-label="No"
              disabled={noScale <= 0.3}
            >
              {noLabel}
            </button>
          </div>

          <div className="mt-6 text-center text-xs font-medium text-zinc-700/80">
            Tip: clicking “No” makes “Yes” inresistable.
          </div>
        </div>
      </main>

      {accepted ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-5 backdrop-blur-sm">
          <div className="val-modal val-card w-full max-w-md rounded-3xl p-6 text-center sm:p-8">
            <div className="relative mx-auto h-32 w-32">
              <Image
                src="/yes-image.gif"
                alt="Celebration"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-900">
              YAY!!! It’s a date 💞
            </h2>
            <p className="mt-2 text-pretty text-zinc-700">
              You just made my whole week. Happy Valentine’s!
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-pink-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/30 active:scale-95"
                onClick={postAboutit}
              >
                Post about it! 🎉
              </button>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-white/75 px-6 py-3 text-sm font-bold text-zinc-900 ring-1 ring-black/10 active:scale-95"
                onClick={(e) => {
                  e.preventDefault();
                  setNoClicks(0);
                  setAccepted(false);
                }}
              >
                Reset everything
              </a>
            </div>
          </div>
          <FloatingHearts seed={99} count={18} />
        </div>
      ) : null}
      </div>
    </>
  );
}
