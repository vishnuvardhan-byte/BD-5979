import { api } from "./api";
import "./PatientList.css";

export default function PatientList({
  patients,
  fetchPatients,
  setEditPatient,
}) {
  const deletePatient = async (id) => {
    await api.delete(`/patients/${id}`);
    fetchPatients();
  };

  return (
    <div>
      <h3>Patients</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.lname}</td>
              <td>{p.email}</td>
              <td>{p.dob}</td>
              <td>{p.phone}</td>
              <td>{p.gender}</td>
              <td>
                <button onClick={() => setEditPatient(p)}>Edit</button>
                <button onClick={() => deletePatient(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
