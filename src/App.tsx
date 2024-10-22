import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Navbar />
        <div className="main-content">
          <h1>Main content area</h1>
          <p>This my page</p>
        </div>
      </div>
    </div>
  );
}

export default App;
