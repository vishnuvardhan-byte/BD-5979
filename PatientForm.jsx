import { useEffect, useState } from "react";
import { api } from "./api";
import "./PatientForm.css";

const initialState = {
  name: "",
  lname: "",
  email: "",
  dob: "",
  phone: "",
  gender: "M",
};

export default function PatientForm({
  fetchPatients,
  editPatient,
  setEditPatient,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editPatient) setForm(editPatient);
  }, [editPatient]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editPatient) {
        await api.patch(`/patients/${editPatient.id}`, form);
      } else {
        await api.post("/patients", form);
      }
      fetchPatients();
      setForm(initialState);
      setEditPatient(null);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editPatient ? "Update Patient" : "Add Patient"}</h3>

      <input name="name" placeholder="First Name" value={form.name} onChange={handleChange} />
      <input name="lname" placeholder="Last Name" value={form.lname} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input type="date" name="dob" value={form.dob} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />

      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="M">Male</option>
        <option value="F">Female</option>
        <option value="O">Other</option>
      </select>

      <button type="submit">
        {editPatient ? "Update" : "Create"}
      </button>
    </form>
  );
}
