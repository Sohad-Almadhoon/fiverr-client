import React, { useEffect, useState } from "react";
import "./GigGallery.scss";

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
  </svg>
);

type Props = { cover?: string; images?: string[]; title?: string };

const GigGallery: React.FC<Props> = ({ cover, images, title }) => {
  // The cover always leads, then any extra images. Duplicates are dropped so a
  // cover that is also listed in images does not appear twice.
  const slides = Array.from(
    new Set([cover, ...(images || [])].filter(Boolean) as string[])
  );
  const [index, setIndex] = useState(0);

  // A gig can be edited or swapped while mounted; keep the index in range.
  useEffect(() => {
    if (index > slides.length - 1) setIndex(0);
  }, [slides.length, index]);

  if (!slides.length) return null;

  const go = (delta: number) =>
    setIndex((i) => (i + delta + slides.length) % slides.length);

  const multiple = slides.length > 1;

  return (
    <div className="gigGallery">
      <div className="stage">
        <img src={slides[index]} alt={title || "Gig image"} />
        {/* Arrows only earn their space when there is somewhere to go. */}
        {multiple && (
          <>
            <button
              type="button"
              className="navBtn prev"
              aria-label="Previous image"
              onClick={() => go(-1)}>
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              className="navBtn next"
              aria-label="Next image"
              onClick={() => go(1)}>
              <Chevron dir="right" />
            </button>
            <span className="counter">
              {index + 1} / {slides.length}
            </span>
          </>
        )}
      </div>

      {multiple && (
        <div className="thumbs">
          {slides.map((src, i) => (
            <button
              type="button"
              key={src}
              className={i === index ? "active" : undefined}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GigGallery;
