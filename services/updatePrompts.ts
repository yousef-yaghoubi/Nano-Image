"use server";

export default async function updatePrompts() {
  await fetch("/api/fetch-prompts");
}
