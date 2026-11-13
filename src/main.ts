import { createScreen, type Element } from "./screen";
import manifest from "./appmeta/manifest.json";

/** The name the app draws under; the device clears elements by this id. */
const APP = manifest.id;

/** People in the meeting before the wheel changes it. */
const DEFAULT_PEOPLE = 4;
const MIN_PEOPLE = 1;
const MAX_PEOPLE = 99;
/** What one person's hour costs, USD. */
const RATE = 100;

/** The counter moves once a second. */
const TICK_MS = 1000;

const WHITE = "#FFFFFFFF";
const GRAY = "#A0A0A0FF";

const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

/** 1234 → "1,234". */
function grouped(n: number): string {
  let text = String(Math.floor(n));
  for (let i = text.length - 3; i > 0; i -= 3) text = `${text.slice(0, i)},${text.slice(i)}`;
  return text;
}

/** "23:41", or "1:02:03" past an hour. */
function duration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const hours = Math.floor(total / 3600);
  const rest = `${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
  return hours > 0 ? `${hours}:${rest}` : rest;
}

/** The front display: the total in whole dollars on top, the headcount and the time under it. */
function frame(cost: number, people: number, elapsed: number): Element[] {
  return [
    { id: "cost", type: "text", text: `$${grouped(cost)}`, font: "bold", color: WHITE, x: 36, y: -1, align: "top_mid" },
    { id: "info", type: "text", text: `${people} ppl  ${duration(elapsed)}`, font: "small", color: GRAY, x: 36, y: 8, align: "top_mid" },
  ];
}

/**
 * Entry point, called at the end of the file: the device runs this script from top to bottom and starts nothing by itself.
 */
function main(): void {
  const report = (err: unknown) => console.error(`${APP}: ${err instanceof Error ? err.message : String(err)}`);
  const screen = createScreen(APP, report);

  let people = DEFAULT_PEOPLE;
  let running = false;
  /** What the meeting has cost so far, USD, and how long it has run without the pauses, ms. */
  let cost = 0;
  let elapsed = 0;
  /** When cost and elapsed were last brought up to date (Date.now() ms). */
  let last = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  let stopped = false;

  const draw = () => {
    if (!stopped) screen.draw(frame(cost, people, elapsed));
  };

  /** Brings the cost up to now at the current headcount: what is spent stays spent when people come or go. */
  function account(): void {
    const now = Date.now();
    if (running) {
      const ms = Math.max(0, now - last);
      elapsed += ms;
      cost += (people * RATE * ms) / 3600000;
    }
    last = now;
  }

  // Clearing a timer that was never set makes the firmware log a warning, so only a running one is cleared.
  const stopTimer = () => {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
  };

  const tick = () => {
    account();
    draw();
  };

  // The listener keeps the app alive; a long Back is handled by the firmware and quits it.
  const unbind = listen("input", (event) => {
    if (stopped) return;
    if (event.key === "encoder") {
      account();
      people = Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, people + event.delta));
    } else if (event.action !== "short") {
      return;
    } else if (event.key === "start") {
      if (running) {
        account();
        running = false;
        stopTimer();
      } else {
        last = Date.now();
        running = true;
        timer = setInterval(tick, TICK_MS);
      }
    } else if (event.key === "ok") {
      stopTimer();
      running = false;
      cost = 0;
      elapsed = 0;
    } else if (event.key === "back") {
      // Back leaves the app: with the timer cleared and the handler detached, nothing keeps it alive.
      stopped = true;
      stopTimer();
      // Not detached from inside the handler itself: the unbind would stop the app while this handler still runs.
      setTimeout(unbind, 0);
      return;
    }
    draw();
  });

  draw();
}

main();
