/** Compare dates by calendar day (local), ignoring time. */
export function eventDayTime(value: string | Date): number {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
}

export function isEventUpcoming(
  date: string,
  now: Date = new Date()
): boolean {
  return eventDayTime(date) >= eventDayTime(now);
}

/**
 * Upcoming soonest-first, then past most-recent-first.
 * Example (today = Feb 2): Feb 6, Feb 7, Feb 8, Jan 29, Jan 28
 */
export function sortEventsByProximity<T extends { date: string }>(
  items: T[],
  now: Date = new Date()
): T[] {
  const today = eventDayTime(now);
  const upcoming: T[] = [];
  const past: T[] = [];

  for (const item of items) {
    if (eventDayTime(item.date) >= today) upcoming.push(item);
    else past.push(item);
  }

  upcoming.sort(
    (a, b) => eventDayTime(a.date) - eventDayTime(b.date)
  );
  past.sort((a, b) => eventDayTime(b.date) - eventDayTime(a.date));

  return [...upcoming, ...past];
}
