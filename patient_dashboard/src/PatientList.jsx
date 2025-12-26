import { api } from "./api";

export default function PatientList({ patients, onEdit, refresh }) {
  const remove = async (id) => {
    await api.delete(`/patients/${id}`);
    refresh();
  };

  return (
    <div className="list">
      <h2>Patients</h2>

      {patients.map((p) => (
        <div key={p.id} className="list-item">
          <div>
            <strong>{p.name} {p.lname}</strong>
            <p>{p.email}</p>
            <p>{p.phone} | {p.gender}</p>
          </div>

          <div className="actions">
            <button onClick={() => onEdit(p)}>Edit</button>
            <button className="danger" onClick={() => remove(p.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
