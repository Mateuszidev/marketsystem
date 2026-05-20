"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicHighlightDTO } from "@/types/highlight";

const AUTOPLAY_INTERVAL_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

type HighlightCarouselProps = {
  highlights: PublicHighlightDTO[];
};

export function HighlightCarousel({ highlights }: HighlightCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const total = highlights.length;
  const safeIndex = total > 0 ? activeIndex % total : 0;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) {
        return;
      }

      const normalized = ((next % total) + total) % total;
      setActiveIndex(normalized);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);
  const goPrev = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);

  useEffect(() => {
    if (total <= 1 || isPaused) {
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [total, isPaused]);

  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    setIsPaused(true);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX ?? null;

    if (startX !== null && endX !== null) {
      const delta = endX - startX;

      if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
        if (delta < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    }

    touchStartX.current = null;
    window.setTimeout(() => setIsPaused(false), 400);
  };

  if (total === 0) {
    return null;
  }

  return (
    <section
      className="hl-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        className="hl-carousel-viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="hl-carousel-track"
          style={{ transform: `translate3d(-${safeIndex * 100}%, 0, 0)` }}
        >
          {highlights.map((highlight, index) => {
            const hasImage = !imageErrors[highlight.id];
            const isCurrent = index === safeIndex;

            return (
              <article
                key={highlight.id}
                className="hl-slide"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${total}`}
                aria-hidden={!isCurrent}
              >
                <HighlightSlide
                  highlight={highlight}
                  hasImage={hasImage}
                  onImageError={() =>
                    setImageErrors((prev) => ({ ...prev, [highlight.id]: true }))
                  }
                />
              </article>
            );
          })}
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              className="hl-carousel-arrow hl-carousel-arrow-prev"
              onClick={goPrev}
              aria-label="Destaque anterior"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="hl-carousel-arrow hl-carousel-arrow-next"
              onClick={goNext}
              aria-label="Próximo destaque"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="hl-carousel-dots" role="tablist" aria-label="Selecionar destaque">
          {highlights.map((highlight, index) => {
            const isCurrent = index === safeIndex;

            return (
              <button
                key={highlight.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Ir para o destaque ${index + 1}`}
                className={`hl-carousel-dot${isCurrent ? " hl-carousel-dot-active" : ""}`}
                onClick={() => goTo(index)}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

type HighlightSlideProps = {
  highlight: PublicHighlightDTO;
  hasImage: boolean;
  onImageError: () => void;
};

function HighlightSlide({ highlight, hasImage, onImageError }: HighlightSlideProps) {
  const buttonText = highlight.buttonText?.trim();
  const buttonLink = highlight.buttonLink?.trim();
  const showButton = Boolean(buttonText && buttonLink);
  const isExternal = buttonLink ? /^https?:\/\//i.test(buttonLink) : false;

  return (
    <div className="hl-slide-card">
      <div className="hl-slide-media">
        {hasImage && highlight.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={highlight.imageUrl}
            alt={highlight.title}
            className="hl-slide-image"
            loading="lazy"
            onError={onImageError}
          />
        ) : (
          <div className="hl-slide-fallback" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className="hl-slide-overlay" aria-hidden="true" />
      </div>

      <div className="hl-slide-content">
        <p className="hl-slide-eyebrow">Em destaque</p>
        <h3 className="hl-slide-title">{highlight.title}</h3>
        {highlight.description ? (
          <p className="hl-slide-description">{highlight.description}</p>
        ) : null}
        {showButton ? (
          isExternal ? (
            <a
              href={buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hl-slide-button"
            >
              {buttonText}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 7h12M8 2l5 5-5 5" />
              </svg>
            </a>
          ) : (
            <Link href={buttonLink || "#"} className="hl-slide-button">
              {buttonText}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 7h12M8 2l5 5-5 5" />
              </svg>
            </Link>
          )
        ) : null}
      </div>
    </div>
  );
}
