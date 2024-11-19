import React, { ChangeEvent, ReactNode, useMemo, useState } from "react";

export interface TableProps {
  columns: Column[];
  data: DataRow[];
  selectable: boolean;
}

export interface DataRow {
  [key: string]: any
}

export interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  render?: (row: DataRow) => ReactNode;
  style?: any;
}

const TableRow = React.memo(
  ({
    row,
    columns,
    selectable,
    isSelected,
    onCheckboxChange,
  }: {
    row: DataRow;
    columns: Column[];
    selectable?: boolean;
    isSelected: boolean;
    onCheckboxChange: () => void;
  }) => {
    return (
      <tr>
        {selectable && (
          <td>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onCheckboxChange}
            />
          </td>
        )}
        {columns.map((column) => (
          <td key={column.id} style={column.style?.()}>
            {column.render ? column.render(row) : row[column.id]}
          </td>
        ))}
      </tr>
    );
  },
  (prevProps, nextProps) =>
    prevProps.row === nextProps.row && prevProps.isSelected === nextProps.isSelected
);

export const CustomTable = ({ columns, data, selectable }: TableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>({ key: "age", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const sortedData = useMemo(() => {
    let sorted = [...data];
    if (sortConfig !== null) {
      sorted = sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedSelectedRows = new Set(prevSelectedRows);
      if (updatedSelectedRows.has(index)) {
        updatedSelectedRows.delete(index);
      } else {
        updatedSelectedRows.add(index);
      }
      return updatedSelectedRows;
    });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(new Set(paginatedData.map((row) => row.name)));
    } else {
      setSelectedRows(new Set());
    }
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {selectable && (
              <th className="checkbox-section">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((row) => selectedRows.has(row.name))
                  }
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                onClick={
                  column.sortable ? () => handleSort(column.id) : undefined
                }
                style={column.style?.()}
              >
                {column.label}{" "}
                {sortConfig?.key === column.id
                  ? sortConfig?.direction === "asc"
                    ? "🠕"
                    : "🠗"
                  : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <TableRow
              key={row.name}
              row={row}
              columns={columns}
              selectable={selectable}
              isSelected={selectedRows.has(row.name)}
              onCheckboxChange={() => handleCheckboxChange(row.name)}
            />
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Backward
        </button>
        <span>
          {currentPage} of {Math.ceil(data.length / rowsPerPage)}
        </span>
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
        >
          Forward
        </button>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="rows-per-page-select"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={3000}>3000</option>
        </select>
      </div>
    </div>
  );
};
