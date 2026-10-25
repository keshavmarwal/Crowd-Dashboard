export default function ErrorState({ message = "Couldn't load this data.", onRetry, height, compact }) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 text-center ${compact ? 'py-2' : 'py-10'}`}
      style={height ? { minHeight: height } : undefined}
    >
      <p className="text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-line px-3 py-1.5 text-sm text-ink hover:bg-page"
        >
          Try again
        </button>
      )}
    </div>
  );
}
