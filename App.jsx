import { useEffect, useState } from "react";
import PatientForm from "./PatientForm";
import PatientList from "./PatientList";
import { api } from "./api";

function App() {
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    const res = await api.get("/patients");
    setPatients(res.data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  /* ---------------- SEARCH LOGIC ---------------- */
  const filteredPatients = patients.filter((p) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    if (!isNaN(term) && p.id === Number(term)) {
      return true;
    }

    return (
      p.name.toLowerCase().includes(term) ||
      p.lname.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.phone.includes(term) ||
      p.gender.toLowerCase().includes(term)
    );
  });

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  /* ---------------- STYLES ---------------- */
  const styles = {
    app: {
      padding: "30px",
      fontFamily: "Inter, system-ui, sans-serif",
      background: "linear-gradient(to right, #eef2ff, #f8fafc)",
      minHeight: "100vh",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#1e3a8a",
      marginBottom: "20px",
    },
    searchBox: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "25px",
      background: "#ffffff",
      padding: "15px",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      maxWidth: "520px",
    },
    input: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "0.9rem",
      outline: "none",
    },
    button: {
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "0.85rem",
      transition: "all 0.25s ease",
    },
    searchBtn: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
    },
    clearBtn: {
      backgroundColor: "#6b7280",
      color: "#ffffff",
    },
  };

  return (
    <div style={styles.app}>
      <h2 style={styles.title}>Patient Management</h2>

      {/* 🔍 SEARCH SECTION */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by ID, name, email, phone, gender"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleSearch}
          style={{ ...styles.button, ...styles.searchBtn }}
        >
          Search
        </button>

        <button
          onClick={clearSearch}
          style={{ ...styles.button, ...styles.clearBtn , background:"red"}}
        >
          Clear
        </button>
      </div>

      <PatientForm
        fetchPatients={fetchPatients}
        editPatient={editPatient}
        setEditPatient={setEditPatient}
      />

      <PatientList
        patients={filteredPatients}
        fetchPatients={fetchPatients}
        setEditPatient={setEditPatient}
      />
    </div>
  );
}

export default App;
