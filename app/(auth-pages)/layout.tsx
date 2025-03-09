import Image from "next/image";
import appName from "./app_name.png";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl">
      <div className="grid grid-cols-6">
        <div className="col-span-2">
          <Image
            src={appName}
            alt="App Name"
            width={720}
            height={720}
            className="w-[1000px]"
          />
        </div>
        <div className="col-span-4 mx-auto my-auto flex flex-col items-start">
          {children}
        </div>
      </div>
    </div>
  );
}
