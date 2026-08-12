"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { cn } from "./cn";

/* -------------------------------------------------------------------------
   Reveal, blur-fade on scroll. Used sparingly: section openers only.
   ------------------------------------------------------------------------- */

/**
 * Scroll reveal, with a guarantee that content always becomes visible.
 *
 * History worth keeping: this started as `useInView` + a conditional `animate`,
 * which left the landing hero's headline and CTA permanently invisible. It was
 * then rewritten with `whileInView`, which failed the same way on the pricing
 * and features heroes. Three separate pages shipped blank because a decorative
 * animation owned whether text existed.
 *
 * So it no longer trusts the observer alone:
 *
 *  1. A synchronous rect check on mount reveals anything already on screen,
 *     before any observer callback has had a chance to fire.
 *  2. An IntersectionObserver handles the genuinely-below-the-fold case.
 *  3. A 700ms timer reveals regardless. If the observer never fires, if it is
 *     unsupported, or if the element sits in a scroll container the observer
 *     doesn't track, the content still appears.
 *
 * The animation is a flourish. The text is the product. When they conflict the
 * text wins.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already on screen at mount: reveal now, no observer round-trip.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    // Backstop. Nothing stays invisible because an observer misbehaved.
    const failsafe = setTimeout(() => setShown(true), 700);

    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
   NumberTicker, counts up when scrolled into view.
   ------------------------------------------------------------------------- */

export function NumberTicker({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 40, stiffness: 90 });
  const [shown, setShown] = useState("0");

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  useEffect(() => {
    // Round rather than truncate. A spring asymptotes just under its target,
    // so 17 renders as "16", fatal on a page whose pitch is honest numbers.
    const fmt = (v: number) => {
      const p = 10 ** decimals;
      return (Math.round(v * p) / p).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    };

    const unsub = spring.on("change", (v) => setShown(fmt(v)));

    // A spring asymptotes just under its target, so it can sit on "2,386"
    // indefinitely. Snap to the exact figure, and start that timer only once
    // the element is actually in view, or it expires before the count begins.
    // On a page whose whole pitch is honest numbers, a stat that never lands
    // on its real value is worse than no animation at all.
    if (!inView) return unsub;
    const settle = setTimeout(() => {
      // Detach the listener *before* snapping, the spring keeps emitting for
      // a while after it looks stopped, and would overwrite the exact figure.
      unsub();
      setShown(fmt(value));
    }, 1500);
    return () => {
      unsub();
      clearTimeout(settle);
    };
  }, [spring, decimals, value, inView]);

  return (
    <span ref={ref} className={cn("figure-num tabular-nums", className)}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------
   SpotlightCard, cursor-tracked glow. One accent colour, low alpha; the
   genre default is a bright ring that turns every card into a light show.
   ------------------------------------------------------------------------- */

export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [on, setOn] = useState(false);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line bg-surface shadow-tight transition-colors duration-300 hover:border-line-strong",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: on ? 1 : 0,
          background: `radial-gradient(340px circle at ${pos.x}px ${pos.y}px, rgba(61,78,232,0.07), transparent 65%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   BorderBeam, a single light travelling the border. Reserved for the one
   element on a page that should pull the eye.
   ------------------------------------------------------------------------- */

export function BorderBeam({ duration = 9 }: { duration?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      style={{
        maskImage:
          "linear-gradient(transparent, transparent), linear-gradient(#000, #000)",
        maskClip: "padding-box, border-box",
        maskComposite: "intersect",
      }}
    >
      <motion.span
        className="absolute aspect-square w-24 rounded-full"
        style={{
          offsetPath: `rect(0 auto auto 0 round 16px)`,
          background:
            "radial-gradient(circle, rgba(61,78,232,0.75) 0%, rgba(61,78,232,0) 65%)",
        }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------
   Typewriter, types a string, then calls back. Drives the hero exchange.
   ------------------------------------------------------------------------- */

export function useTypewriter(text: string, active: boolean, cps = 42) {
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!active) {
      setOut("");
      return;
    }
    // Respect reduced motion by showing the line immediately.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setOut(text);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 1000 / cps);
    return () => clearInterval(id);
  }, [text, active, cps]);

  return out;
}
