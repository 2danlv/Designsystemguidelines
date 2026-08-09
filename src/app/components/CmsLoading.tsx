export function CmsLoading({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div
      className={`${fullScreen ? "min-h-screen" : "min-h-[50vh]"} flex items-center justify-center bg-white`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#002d17]/15 border-t-[#f4aa1f]" />
    </div>
  );
}
