export const getTimeSince = (lastModified: number): string => {
  const secondsPassed = Math.floor((Date.now() - lastModified) / 1000);
  if (secondsPassed <= 0) return "just now";

  const result = { unit: "", number: 0 };
  const timeUnits = ["second", "minute", "hour", "day", "week", "month", "year"];
  const timeSeconds = [1, 60, 3600, 86400, 604800, 2592000, 315360000];

  for (const seconds of timeSeconds) {
    if (secondsPassed >= seconds) {
      result.number = Math.round(secondsPassed / seconds);
      result.unit = `${timeUnits[timeSeconds.indexOf(seconds)]}${result.number > 1 ? "s" : ""}`;
    }
  }

  return `${result.number} ${result.unit} ago`;
};
