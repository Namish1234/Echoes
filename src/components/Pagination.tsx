import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-8">
      <button 
        onClick={() => {
          onPageChange(currentPage - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={currentPage === 1}
        className="px-4 py-2 border-4 border-wtf-black font-black text-sm md:text-base uppercase tracking-widest bg-wtf-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-wtf-black hover:text-wtf-white transition-all shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:translate-y-1 active:shadow-none disabled:shadow-none"
      >
        Prev
      </button>
      
      <div className="flex gap-2 mx-2">
        {pages.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              if (typeof p === 'number') {
                onPageChange(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={p === '...'}
            className={`w-10 h-10 md:w-12 md:h-12 border-4 border-wtf-black font-black text-lg flex items-center justify-center transition-all ${p === currentPage ? 'bg-wtf-orange text-wtf-black shadow-[4px_4px_0px_#000] -translate-y-1' : p === '...' ? 'border-transparent bg-transparent opacity-50 text-2xl cursor-default' : 'bg-wtf-white hover:bg-wtf-black hover:text-wtf-white text-wtf-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:translate-y-1 active:shadow-[0px_0px_0px_#000]'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <button 
        onClick={() => {
          onPageChange(currentPage + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border-4 border-wtf-black font-black text-sm md:text-base uppercase tracking-widest bg-wtf-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-wtf-black hover:text-wtf-white transition-all shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:translate-y-1 active:shadow-none disabled:shadow-none"
      >
        Next
      </button>
    </div>
  );
}
