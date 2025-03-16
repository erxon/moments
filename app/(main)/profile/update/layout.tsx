import Navigation from "./navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Navigation />
        </div>
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
