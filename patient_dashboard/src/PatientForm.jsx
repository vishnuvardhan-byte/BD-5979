import { useEffect, useState } from "react";
import { api } from "./api";

const initialState = {
  name: "",
  lname: "",
  email: "",
  dob: "",
  phone: "",
  gender: "",
};

export default function PatientForm({ editPatient, refresh, clearEdit }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editPatient) setForm(editPatient);
  }, [editPatient]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    if (editPatient) {
      await api.patch(`/patients/${editPatient.id}`, form);
    } else {
      await api.post("/patients", form);
    }

    setForm(initialState);
    clearEdit();
    refresh();
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>{editPatient ? "Update Patient" : "Create Patient"}</h2>

      {["name", "lname", "email", "dob", "phone"].map((field) => (
        <input
          key={field}
          name={field}
          value={form[field]}
          placeholder={field.toUpperCase()}
          onChange={handleChange}
          type={field === "dob" ? "date" : "text"}
        />
      ))}

      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="">Gender</option>
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
