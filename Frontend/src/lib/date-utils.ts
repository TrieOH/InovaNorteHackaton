export function timeAgo(created_at: string): string {
  const now = new Date();
  const postDate = new Date(created_at);
  const diffMs = now.getTime() - postDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);
  const weeks   = Math.floor(days / 7);

  if (seconds < 60) return `há ${seconds} segundos`;
  if (minutes < 60) return `há ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  if (hours < 24)   return `há ${hours} ${hours === 1 ? "hora" : "horas"}`;
  if (days < 7)     return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  return `há ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
}