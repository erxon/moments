export default function LoadErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-sm text-neutral-500">{children}</p>;
}
