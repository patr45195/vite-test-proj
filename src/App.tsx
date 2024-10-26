import "./App.css";
import { Column, CustomTable } from "./components/CustomTable";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import { TABLE_DATA } from "./constants";

function App() {
  const columns: Column[] = [
    { id: "name", label: "Name", sortable: true },
    { id: "age", label: "Age", sortable: true },
    {
      id: "email",
      label: "Email",
      render: (row) => {
        return <div>{row.email}</div>;
      },
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <button onClick={() => alert(`Editing ${row.name}`)}>Edit</button>
      ),
    },
  ];

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Navbar />
        <div className="main-content">
          <CustomTable columns={columns} data={TABLE_DATA} />
        </div>
      </div>
    </div>
  );
}

export default App;
