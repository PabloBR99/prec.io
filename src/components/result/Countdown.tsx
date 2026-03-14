"use client";

import { useState, useCallback } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { motion } from "framer-motion";

interface CountdownProps {
  readonly visible: boolean;
}

export function Countdown({ visible }: CountdownProps) {
  const { hours, minutes } = useCountdown();
  const [bellState, setBellState] = useState<
    "idle" | "granted" | "denied"
  >("idle");

  const handleReminder = useCallback(async () => {
    if (!("Notification" in window)) {
      setBellState("denied");
      return;
    }

    if (Notification.permission === "granted") {
      scheduleReminder(hours, minutes);
      setBellState("granted");
      return;
    }

    if (Notification.permission === "denied") {
      setBellState("denied");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      scheduleReminder(hours, minutes);
      setBellState("granted");
    } else {
      setBellState("denied");
    }
  }, [hours, minutes]);

  const label =
    bellState === "granted"
      ? "Te avisaremos"
      : `Siguiente producto en ${hours}h ${minutes}min`;

  return (
    <motion.button
      type="button"
      onClick={bellState !== "granted" ? handleReminder : undefined}
      initial={false}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`group flex items-center gap-1.5 text-xs transition-colors ${
        bellState === "granted"
          ? "text-foreground/45 cursor-default"
          : "text-foreground/45 hover:text-foreground/70 cursor-pointer"
      }`}
    >
      {/* Bell icon */}
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          bellState === "granted"
            ? "text-foreground/50"
            : "text-foreground/35 group-hover:text-foreground/60 transition-colors"
        }
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        {bellState === "granted" && (
          <line x1="1" y1="1" x2="23" y2="23" strokeWidth="1.5" />
        )}
      </svg>
      {label}
    </motion.button>
  );
}

function scheduleReminder(hours: number, minutes: number) {
  const ms = (hours * 60 + minutes) * 60 * 1000;
  if (ms <= 0) return;

  setTimeout(() => {
    if (Notification.permission === "granted") {
      new Notification("Pricer", {
        body: "Hay un nuevo producto listo para adivinar",
        icon: "/icon-192.png",
      });
    }
  }, ms);
}
