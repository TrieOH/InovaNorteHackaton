import { HttpClient } from ".";

export const api = new HttpClient(
  "http://localhost:8080",
  { Accept: "application/json", "Content-Type": "application/json" },
  8000,
  1,
  "server"
);