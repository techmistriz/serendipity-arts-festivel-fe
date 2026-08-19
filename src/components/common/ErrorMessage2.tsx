interface ErrorMessageProps {
  message?: string | null;
  className?: string;
}

export default function ErrorMessage({
  message = "Something went wrong",
  className = "",
}: ErrorMessageProps) {
  return (
    <div className={`flex items-center justify-center py-10 text-sm text-red-500 ${className}`}>
      {message}
    </div>
  );
}
