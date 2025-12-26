import { useEffect, useState } from "react";
import { api } from "./api";
import PatientForm from "./PatientForm";
import PatientList from "./PatientList";
import "./styles.css";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);

  const fetchPatients = async () => {
    const res = await api.get("/patients");
    setPatients(res.data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="container">
      <h1>Patient Management</h1>

      <PatientForm
        editPatient={editPatient}
        refresh={fetchPatients}
        clearEdit={() => setEditPatient(null)}
      />

      <PatientList
        patients={patients}
        onEdit={setEditPatient}
        refresh={fetchPatients}
      />
    </div>
  );
}
