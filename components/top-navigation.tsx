import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Search from "./search";
import Breadcrumbs from "./breadcrumbs";

export default function TopNavigation() {
  return (
    <div>
      <div className="w-full flex justify-between items-center py-3 text-sm gap-2">
        <SidebarTrigger />
        <Search />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
