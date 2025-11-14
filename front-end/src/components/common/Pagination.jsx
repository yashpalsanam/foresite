import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

/**
 * Pagination Component
 * Handles pagination for property listings
 */

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPages = 5,
  className = '',
  baseUrl = '/properties',
  useLinks = false,
}) => {
  if (totalPages <= 1) return null;

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const PageButton = ({ page, children, disabled = false }) => {
    const isActive = page === currentPage;
    
    const buttonClasses = clsx(
      'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
      isActive && 'bg-primary-600 text-white',
      !isActive && !disabled && 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300',
      disabled && 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
    );

    if (useLinks && !disabled && page !== currentPage) {
      return (
        <Link
          href={`${baseUrl}?page=${page}`}
          className={buttonClasses}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        onClick={() => handlePageClick(page)}
        disabled={disabled}
        className={buttonClasses}
      >
        {children}
      </button>
    );
  };

  return (
    <nav
      className={clsx('flex items-center justify-center space-x-2', className)}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <PageButton
        page={currentPage - 1}
        disabled={currentPage === 1}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </PageButton>

      {/* First page if not visible */}
      {pageNumbers[0] > 1 && (
        <>
          <PageButton page={1}>1</PageButton>
          {pageNumbers[0] > 2 && (
            <span className="px-2 text-neutral-500">...</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <PageButton key={page} page={page}>
          {page}
        </PageButton>
      ))}

      {/* Last page if not visible */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 text-neutral-500">...</span>
          )}
          <PageButton page={totalPages}>{totalPages}</PageButton>
        </>
      )}

      {/* Next Button */}
      <PageButton
        page={currentPage + 1}
        disabled={currentPage === totalPages}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </PageButton>
    </nav>
  );
};

/**
 * Simple pagination info
 */
export const PaginationInfo = ({ currentPage, totalPages, totalItems, itemsPerPage }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="text-sm text-neutral-600 text-center my-4">
      Showing <span className="font-medium">{startItem}</span> to{' '}
      <span className="font-medium">{endItem}</span> of{' '}
      <span className="font-medium">{totalItems}</span> results
    </div>
  );
};

export default Pagination;
