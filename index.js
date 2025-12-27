const express = require("express");
const app = express();

app.use(express.json()); // MUST be first


const cors = require("cors");

app.use(cors()); // ✅ allow frontend requests
app.use(express.json());



/* -------------------- In-memory DB -------------------- */
let patients = [];
let idCounter = 1;

/* -------------------- Validators -------------------- */

const isValidEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@gmail\.(com|in)$/.test(email);

const isValidDOB = (dob) => {
  const date = new Date(dob);
  const today = new Date();
  return !isNaN(date) && date <= today;
};

/* -------------------- DTO Middleware -------------------- */
function validatePatient(req, res, next) {
  const { name, lname, email, dob, phone, gender } = req.body;

  if (!name || name.length < 3)
    return res
      .status(400)
      .json({ message: "Name must be at least 3 characters" });

  if (!lname || lname.length < 3)
    return res
      .status(400)
      .json({ message: "Last name must be at least 3 characters" });

  if (!email || !isValidEmail(email))
    return res.status(400).json({ message: "Invalid email format" });

  if (!dob || !isValidDOB(dob))
    return res
      .status(400)
      .json({ message: "DOB must not be greater than current date" });

  if (!phone || !/^[6-9]\d{9}$/.test(phone))
    return res
      .status(400)
      .json({ message: "Phone must be 10 digits and start with 8 to 9" });

  const fullNameExists = patients.some(
    (p) =>
      p.name.toLowerCase().trim() === name.toLowerCase().trim() &&
      p.lname.toLowerCase().trim() === lname.toLowerCase().trim() &&
      p.id !== req.params.id // ignore same record during update
  );

  if (fullNameExists) {
    return res.status(409).json({
      message: "Patient with same first name and last name already exists",
    });
  }

  const phoneExists = patients.some(
    (p) => p.phone === phone && p.id !== req.params.id
  );
  if (phoneExists)
    return res.status(409).json({ message: "Phone number already exists" });

  const emailExists = patients.some(
    (p) => p.email === email && p.id !== req.params.id
  );

  if (emailExists) {
    return res.status(409).json({ message: "Email already exists" });
  }

  if (!["M", "F", "O"].includes(gender))
    return res.status(400).json({ message: "Gender must be M, F, or O" });

  next();
}

/* -------------------- CREATE -------------------- */
app.post("/patients", validatePatient, (req, res) => {
  const patient = {
    id: idCounter++,
    ...req.body,
  };

  patients.push(patient);
  res.status(201).json(patient);
  console.log("Data Stored");
});

/* -------------------- READ ALL -------------------- */
app.get("/patients", (req, res) => {
  res.json(patients);
});

/* -------------------- READ ONE -------------------- */
app.get("/patients/:id", (req, res) => {
  const patient = patients.find((p) => p.id == req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });

  res.json(patient);
});

// /* -------------------- UPDATE -------------------- */
// app.patch("/patients/:id", validatePatient, (req, res) => {
//   const index = patients.findIndex((p) => p.id == req.params.id);

//   if (index === -1) {
//     return res.status(404).json({ message: "Patient not found" });
//   }

//   patients[index] = {
//     ...patients[index], // keep existing fields
//     ...req.body, // update only sent fields
//     id: patients[index].id, // ensure id never changes
//   };

//   res.status(200).json({
//     message: "Patient updated successfully",
//     data: patients[index],
//   });
// });

function validatePatient(req, res, next) {
  const { name, lname, email, dob, phone, gender } = req.body;
  const isPatch = req.method === "PATCH";

  /* ---------- Name ---------- */
  if (!isPatch || name !== undefined) {
    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        message: "Name must be at least 3 characters",
      });
    }
  }

  /* ---------- Last Name ---------- */
  if (!isPatch || lname !== undefined) {
    if (!lname || lname.trim().length < 3) {
      return res.status(400).json({
        message: "Last name must be at least 3 characters",
      });
    }
  }

  /* ---------- Email ---------- */
  if (!isPatch || email !== undefined) {
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        message: "Email must be @gmail.com or @gmail.in",
      });
    }
  }

  /* ---------- DOB ---------- */
  if (!isPatch || dob !== undefined) {
    if (!dob || !isValidDOB(dob)) {
      return res.status(400).json({
        message: "DOB must not be greater than current date",
      });
    }
  }

  /* ---------- Phone ---------- */
  if (!isPatch || phone !== undefined) {
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone must be 10 digits and start with 6 to 9",
      });
    }
  }

  /* ---------- Gender ---------- */
  if (!isPatch || gender !== undefined) {
    if (!["M", "F", "O"].includes(gender)) {
      return res.status(400).json({
        message: "Gender must be M, F, or O",
      });
    }
  }

  /* ---------- DUPLICATE CHECKS (ONLY FOR POST) ---------- */
  if (!isPatch) {
    const fullNameExists = patients.some(
      (p) =>
        p.name.toLowerCase().trim() === name.toLowerCase().trim() &&
        p.lname.toLowerCase().trim() === lname.toLowerCase().trim()
    );

    if (fullNameExists) {
      return res.status(409).json({
        message: "Patient with same first name and last name already exists",
      });
    }

    const phoneExists = patients.some((p) => p.phone === phone);
    if (phoneExists) {
      return res.status(409).json({
        message: "Phone number already exists",
      });
    }

    const emailExists = patients.some((p) => p.email === email);
    if (emailExists) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
  }

  next();
}

app.patch("/patients/:id", validatePatient, (req, res) => {
  const index = patients.findIndex((p) => p.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Patient not found" });
  }

  patients[index] = {
    ...patients[index],
    ...req.body,
    id: patients[index].id,
  };

  res.status(200).json({
    message: "Patient updated successfully",
    data: patients[index],
  });
});

/* -------------------- DELETE -------------------- */
app.delete("/patients/:id", (req, res) => {
  const index = patients.findIndex((p) => p.id == req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Patient not found" });

  patients.splice(index, 1);
  res.json({ message: "Patient deleted successfully" });
});

/* -------------------- SERVER -------------------- */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
