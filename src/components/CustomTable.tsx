import { ReactNode, useEffect, useState } from "react";

export interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  render?: (row: DataRow) => ReactNode;
}

export interface DataRow {
  [key: string]: any;
}

interface TableProps {
  columns: Column[];
  data: DataRow[];
}

export const CustomTable = ({ columns, data }: TableProps) => {
  const [sortedData, setSortedData] = useState<DataRow[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>({ key: "age", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

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

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
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
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.id}>
                  {column.render ? column.render(row) : row[column.id]}
                </td>
              ))}
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
      </div>
    </div>
  );
};
