import en from "./en.json";

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function translateMessage(message?: string) {
  if (!message) return undefined;

  const numbers: string[] = [];
  const placeholderMsg = message.replace(/\d+/g, (match) => {
    numbers.push(match);
    return "{n}";
  });

  const key = norm(placeholderMsg);
  let translated = en[key as keyof typeof en];

  if (!translated) return message;

  let i = 0;
  translated = translated.replace(/\{n\}/g, () => numbers[i++] ?? "{n}");

  return translated;
}