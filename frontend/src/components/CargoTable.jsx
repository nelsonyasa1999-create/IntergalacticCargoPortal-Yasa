import { useMemo, useState } from 'react';
import { formatWeight, isEarthDestination, sortCargo } from '../utils/cargo';

const PAGE_SIZES = [25, 50, 100, 250];
const DEFAULT_PAGE_SIZE = 100;

export default function CargoTable({ cargo, role }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const sorted = useMemo(() => sortCargo(cargo), [cargo]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const hasMultiplePages = totalPages > 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(startIndex, startIndex + pageSize);
  const visibleStart = sorted.length === 0 ? 0 : startIndex + 1;
  const visibleEnd = Math.min(startIndex + pageSize, sorted.length);

  const goToPage = (targetPage) => {
    setPage(Math.min(totalPages, Math.max(1, targetPage)));
  };

  if (sorted.length === 0) {
    return (
      <p className="empty-state">
        No cargo in registry. Admins may upload <code>manifest.txt</code> to populate.
      </p>
    );
  }

  return (
    <>
      <div className="table-toolbar">
        <span aria-live="polite">
          Showing {visibleStart}-{visibleEnd} of {sorted.length}
        </span>
        <label htmlFor="cargo-page-size">
          Rows
          <select
            id="cargo-page-size"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <table className="cargo-table">
          <thead>
            <tr>
              <th>Cargo ID</th>
              <th>Date</th>
              <th>Weight</th>
              <th>Destination</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((item) => {
              const earth = isEarthDestination(item.destination);
              return (
                <tr key={item.id} className={earth ? 'row-earth' : ''}>
                  <td>
                    <code className="cargo-id">{item.cargo_id}</code>
                  </td>
                  <td>{item.shipment_date}</td>
                  <td className="weight-cell">{formatWeight(item.weight_kg, role)}</td>
                  <td>
                    {item.destination}
                    {earth && <span className="earth-pin">Pinned</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasMultiplePages ? (
        <nav className="pagination" aria-label="Cargo table pagination">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            aria-label="Go to first page"
          >
            First
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span aria-live="polite">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            Next
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Go to last page"
          >
            Last
          </button>
        </nav>
      ) : (
        <p className="pagination-note">All rows shown</p>
      )}
    </>
  );
}
