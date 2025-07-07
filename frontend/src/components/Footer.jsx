import React from 'react';
import './Footer.css';

const Footer = ({ totalPages, currentPage, setCurrentPage, totalL, currentL }) => {

  const chunkSize = 4;
  const currentChunkStart = Math.floor((currentPage - 1) / chunkSize) * chunkSize;


  const pages = Array.from(
    { length: Math.min(chunkSize, totalPages - currentChunkStart) },
    (_, i) => currentChunkStart + i + 1
  );

  return (
    <div className="table-footer">
      <div className="entry-count">
        Showing {currentL} out of {totalL} entries
      </div>

      <div className="pagination">

        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {currentChunkStart > 0 && (
          <button onClick={() => setCurrentPage(currentChunkStart)}>
            ...
          </button>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}

        {currentChunkStart + chunkSize < totalPages && (
          <button
            onClick={() =>
              setCurrentPage(Math.min(currentChunkStart + chunkSize + 1, totalPages))
            }
          >
            ...
          </button>
        )}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

      </div>
    </div>
  );
};

export default Footer;
