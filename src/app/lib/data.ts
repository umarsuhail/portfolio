"use cache";

import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache";
import { projects, skills } from "@/utils/constants";

// Cached portfolio data — tagged so sets can be revalidated independently.
// Call revalidateTag("projects") from the /api/revalidate route to bust only project cards.

export async function getProjects() {
  "use cache";
  cacheTag("projects");
  cacheLife("weeks");
  return projects;
}

export async function getSkills() {
  "use cache";
  cacheTag("skills");
  cacheLife("weeks");
  return skills;
}
