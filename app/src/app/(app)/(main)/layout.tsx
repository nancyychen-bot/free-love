import { requireCompletedOnboarding } from "@/lib/auth/require-onboarding";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCompletedOnboarding();
  return <>{children}</>;
}
