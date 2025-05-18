export default function NotFound() {
  return (
    <div className="flex w-full items-center justify-center" style={{ height: "calc(100vh - 60px)" }}>
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}