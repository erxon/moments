import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Search from "./search";

export default function TopNavigation() {
  return (
    <div className="w-full flex justify-between items-center py-3 text-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <Search />
      <ThemeSwitcher />
    </div>
  );
}
