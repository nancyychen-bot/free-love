import { getUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

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

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  // If onboarding is not complete, redirect to the correct step
  // (but only if they're not already on an onboarding page)
  if (!user.onboardingComplete) {
    const headersList = await headers();
    const pathname = headersList.get("x-next-pathname") ?? headersList.get("x-invoke-path") ?? "";
    const isOnboardingPage = pathname.startsWith("/onboarding");

    if (!isOnboardingPage) {
      const targetRoute = stepRoutes[user.onboardingStep] ?? "/onboarding/pledge";
      redirect(targetRoute);
    }
  }

  return <>{children}</>;
}
