export function truncateDescription(
  description: string,
  maxWords: number
): string {
  const words: string[] = description.split(" ");
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return description;
}
