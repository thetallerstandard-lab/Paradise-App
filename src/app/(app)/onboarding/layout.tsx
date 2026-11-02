import { OnboardingProgress } from "./progress";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <OnboardingProgress />
      {children}
    </div>
  );
}
