import React from "react";
import { Icon } from "../../elements";

export default function TableHeader({
  config = {},
  id,
  pageSize,
  changePageSize,
  recordLength,
  filterRecords,
  exportToExcel,
  exportToPDF,
}) {
  const showButtons = config.button || {};
  const shouldShowHeader =
    config.show_length_menu ||
    config.show_filter ||
    showButtons.excel ||
    showButtons.print;

  if (!shouldShowHeader) return null;

  return (
    <div className="hide-on-print">
      <div
        className="d-flex justify-content-between align-items-center flex-wrap p-2 bg-white border rounded shadow-sm mb-3"
        id={id ? `${id}-table-head` : undefined}
      >
        {/* Left Section: Page size dropdown */}
        <div className="d-flex align-items-center me-3 mb-2 mb-md-0">
          {config.show_length_menu && (
            <label className="d-flex align-items-center mb-0">
              <span className="me-2 fw-semibold">Show</span>
              <select
                className="form-select form-select-sm"
                value={pageSize}
                onChange={changePageSize}
                style={{ width: "70px" }}
              >
                {config.length_menu.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
                {!config.length_menu.includes(recordLength) && (
                  <option value={recordLength}>All</option>
                )}
              </select>
            </label>
          )}
        </div>

        {/* Right Section: Buttons + Search */}
        <div className="d-flex align-items-center gap-2 flex-wrap ms-1">
          {/* Excel Export */}
          {showButtons.excel && (
            <button
              type="button"
              className="btn btn-outline-success btn-sm d-flex align-items-center"
              title="Export to Excel"
              onClick={exportToExcel}
            >
              <Icon name="grid_on" className="me-1" type="round" />
              Excel
            </button>
          )}

          {/* Print + Search */}
          {(config.show_filter || showButtons.print) && (
            <div className="d-flex align-items-center gap-2">
              {showButtons.print && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                  title="Print"
                  onClick={exportToPDF}
                >
                  <Icon name="print" className="me-1" type="round" />
                  Print
                </button>
              )}

              {config.show_filter && (
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder={config.language?.filter || "Search..."}
                  onChange={filterRecords}
                  aria-label="Search records"
                  style={{ width: "220px" }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
