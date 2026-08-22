import { redirect } from "next/navigation";
import { getUser } from "./get-user";

const stepRoutes: Record<number, string> = {
  1: "/onboarding/pledge",
  2: "/onboarding/identity",
  3: "/onboarding/physical",
  4: "/onboarding/partnership",
  5: "/onboarding/beliefs",
  6: "/onboarding/lifestyle",
  7: "/onboarding/qualities",
  8: "/onboarding/values",
  9: "/onboarding/life-answers",
  10: "/onboarding/photos",
};

/**
 * Call at the top of any page that requires onboarding to be complete.
 * If not complete, redirects to the user's current onboarding step.
 */
export async function requireCompletedOnboarding() {
  const user = await getUser();
  if (!user) redirect("/login");
  if (!user.onboardingComplete) {
    const target = stepRoutes[user.onboardingStep] ?? "/onboarding/pledge";
    redirect(target);
  }
  return user;
}
