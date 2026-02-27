import PhaseDurationSliders from "@/features/settings/components/PhaseDurationSliders";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-white text-5xl font-bold">Settings</h1>
      <p className="text-blue-200 pt-3 mb-15">
        Manage your settings and personalize your experience.
      </p>
      <PhaseDurationSliders></PhaseDurationSliders>
    </div>
  );
}
