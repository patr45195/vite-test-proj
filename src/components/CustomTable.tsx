import { ChangeEvent, ReactNode, useEffect, useState } from "react";

export interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  render?: (row: DataRow) => ReactNode;
  style?: any;
}

export interface DataRow {
  [key: string]: any;
}

interface TableProps {
  columns: Column[];
  data: DataRow[];
  selectable?: boolean;
}

export const CustomTable = ({ columns, data, selectable }: TableProps) => {
  const [sortedData, setSortedData] = useState<DataRow[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>({ key: "age", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
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
    setSortedData(sorted);
  }, [data, sortConfig]);

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

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {selectable && (
              <th>
                <input type="checkbox" />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                onClick={
                  column.sortable ? () => handleSort(column.id) : undefined
                }
                style={{ cursor: column.sortable ? "pointer" : "default" }}
              >
                {column.label}{" "}
                {sortConfig?.key === column.id
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.name}>
              {selectable && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.name)}
                    onChange={() => handleCheckboxChange(row.name)}
                  />
                </td>
              )}
              {columns.map((column) => {
                return (
                  <td key={column.id} style={column.style && column.style()}>
                    {column.render ? column.render(row) : row[column.id]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Назад
        </button>
        <span>
          {currentPage} из {Math.ceil(data.length / rowsPerPage)}
        </span>
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
        >
          Вперед
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
