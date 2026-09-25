import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
export function ProjectCarousel({ children }: { children: ReactNode[] }) {
  const reduced = useReducedMotion();
  const [small, setSmall] = useState(
    () => matchMedia("(max-width: 800px)").matches
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const visible = small ? 1 : Math.min(2, children.length);
  const max = Math.max(0, children.length - visible);
  const current = Math.min(index, max);
  useEffect(() => {
    const media = matchMedia("(max-width: 800px)");
    const sync = () => setSmall(media.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!playing || reduced || hovering || !max) return;
    const timer = setInterval(
      () => setIndex((i) => (i >= max ? 0 : i + 1)),
      5500
    );
    return () => clearInterval(timer);
  }, [playing, reduced, hovering, max]);
  function move(direction: number) {
    setPlaying(false);
    setIndex((i) => (Math.min(i, max) + direction + max + 1) % (max + 1));
  }
  return (
    <div
      className="project-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setHovering(false);
      }}
    >
      <div className="project-viewport">
        <div
          className="project-slider"
          style={
            {
              "--visible-cards": Math.max(1, visible),
              "--slide-index": current,
            } as React.CSSProperties
          }
        >
          {children.map((child, i) => (
            <div
              className="project-slide"
              key={i}
              inert={i < current || i >= current + visible}
              aria-hidden={i < current || i >= current + visible}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${children.length}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {max > 0 && (
        <div className="carousel-controls">
          <span aria-live={playing ? "off" : "polite"}>
            {current + 1} / {max + 1}
          </span>
          <div>
            <button
              className="secondary-button"
              aria-label="Previous project"
              onClick={() => move(-1)}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              className="secondary-button"
              aria-label={
                playing ? "Pause project animation" : "Play project animation"
              }
              disabled={reduced}
              onClick={() => setPlaying(!playing)}
            >
              {playing && !reduced ? <Pause size={17} /> : <Play size={17} />}
            </button>
            <button
              className="secondary-button"
              aria-label="Next project"
              onClick={() => move(1)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
