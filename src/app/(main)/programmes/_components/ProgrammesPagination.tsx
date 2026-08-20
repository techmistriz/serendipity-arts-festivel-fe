type ProgrammesPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function ProgrammesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProgrammesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="headline border border-foreground px-4 py-2 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
      >
        ← Prev
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`headline min-w-[40px] border px-3 py-2 text-xs tracking-[0.06em] uppercase transition-colors ${
            page === currentPage
              ? "border-foreground bg-foreground text-background"
              : "border-foreground hover:bg-foreground hover:text-background"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="headline border border-foreground px-4 py-2 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
      >
        Next →
      </button>
    </nav>
  );
}
