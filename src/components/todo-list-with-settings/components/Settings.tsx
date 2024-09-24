import React from "react";
import * as Switch from "@radix-ui/react-switch";
import { useTodoStore } from "../../../store/todoStore";

export function Settings() {
  const { settings, toggleSetting } = useTodoStore();

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <div className="space-y-4">
        <SettingItem
          id="voz-news"
          label="Voz news recommendations"
          checked={settings.vozNewsRecommendations}
          onChange={() => toggleSetting("vozNewsRecommendations")}
        />
        <SettingItem
          id="linkedin"
          label="LinkedIn recommendations"
          checked={settings.linkedinRecommendations}
          onChange={() => toggleSetting("linkedinRecommendations")}
        />
        <SettingItem
          id="github"
          label="Top GitHub repositories of the week"
          checked={settings.topGithubRepositories}
          onChange={() => toggleSetting("topGithubRepositories")}
        />
      </div>
    </div>
  );
}

function SettingItem({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-default"
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
    </div>
  );
}
