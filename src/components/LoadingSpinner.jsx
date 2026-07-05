function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="size-10 animate-spin rounded-full border-2 border-brown-900 border-t-transparent"
        role="status"
        aria-label="Loading"
      />
      <p className="font-medium text-brown-900">Loading...</p>
    </div>
  );
}

export default LoadingSpinner;
