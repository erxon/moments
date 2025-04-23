import Image from "next/image";
import appName from "./app_name.png";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl min-h-screen grid content-center mx-auto">
      <div>
        <div className="md:grid md:grid-cols-6 flex flex-col items-center">
          <div className="md:col-span-3 mb-2 md:flex md:justify-center">
            <Image
              src={appName}
              alt="App Name"
              width={720}
              height={720}
              className="w-[170px] md:w-[400px]"
            />
          </div>
          <div className="md:col-span-3 mx-auto my-auto flex flex-col items-start">
            {children}
            <div className="flex items-center gap-3">
              <p className="text-sm">Change theme</p>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
