import { GAME_TIMEZONE, LAUNCH_DATE } from "@/lib/constants";

export function getGameDate(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: GAME_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

export function getNextMidnight(): Date {
  const now = new Date();
  const madridNow = new Date(
    now.toLocaleString("en-US", { timeZone: GAME_TIMEZONE })
  );
  const midnight = new Date(madridNow);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = midnight.getTime() - madridNow.getTime();
  return new Date(now.getTime() + diffMs);
}

export function getGameNumber(date: string): number {
  const launch = new Date(LAUNCH_DATE);
  const current = new Date(date);
  const diffMs = current.getTime() - launch.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}
