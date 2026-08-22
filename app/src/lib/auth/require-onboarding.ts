import { redirect } from "next/navigation";
import { getUser } from "./get-user";

const stepRoutes: Record<number, string> = {
  1: "/onboarding/pledge",
  2: "/onboarding/pledge",
  3: "/onboarding/identity",
  4: "/onboarding/dealbreakers",
  5: "/onboarding/qualities",
  6: "/onboarding/values",
  7: "/onboarding/life-answers",
  8: "/onboarding/life-answers",
  9: "/onboarding/photos",
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
