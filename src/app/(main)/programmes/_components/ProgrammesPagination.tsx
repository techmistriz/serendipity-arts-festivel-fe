import { getPageNumbers } from "../constants";

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

  const visiblePages = getPageNumbers(currentPage, totalPages);
  const firstVisiblePage = visiblePages[0];
  const lastVisiblePage = visiblePages.at(-1);

  return (
    <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="headline border border-foreground px-4 py-2 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
      >
        ← Prev
      </button>

      {firstVisiblePage > 1 && (
        <button
          type="button"
          onClick={() => onPageChange(1)}
          aria-current={currentPage === 1 ? "page" : undefined}
          className={`headline min-w-[40px] border px-3 py-2 text-xs tracking-[0.06em] uppercase transition-colors ${
            currentPage === 1
              ? "border-foreground bg-foreground text-background"
              : "border-foreground hover:bg-foreground hover:text-background"
          }`}
        >
          1
        </button>
      )}

      {firstVisiblePage > 2 && (
        <span className="px-1 text-sm text-muted-foreground" aria-hidden="true">
          …
        </span>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
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

      {lastVisiblePage !== undefined && lastVisiblePage < totalPages - 1 && (
        <span className="px-1 text-sm text-muted-foreground" aria-hidden="true">
          …
        </span>
      )}

      {lastVisiblePage !== undefined && lastVisiblePage < totalPages && (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          aria-current={currentPage === totalPages ? "page" : undefined}
          className={`headline min-w-[40px] border px-3 py-2 text-xs tracking-[0.06em] uppercase transition-colors ${
            currentPage === totalPages
              ? "border-foreground bg-foreground text-background"
              : "border-foreground hover:bg-foreground hover:text-background"
          }`}
        >
          {totalPages}
        </button>
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="headline border border-foreground px-4 py-2 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
      >
        Next →
      </button>
    </nav>
  );
}
