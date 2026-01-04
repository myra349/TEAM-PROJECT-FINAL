import React, { useState } from "react";

/*
===========================================================
SMART SPACE MANAGEMENT – ADVANCED SINGLE FILE FRONTEND
Correct • Complex • Backend-Ready • Final-Year Level
===========================================================
*/

export default function AdminDashboard() {

  /* ---------------- STATE ---------------- */
  const [form, setForm] = useState({
    length: "",
    width: "",
    seatType: "chair",
    students: "",
    boardSide: "top",
  });

  const [doors, setDoors] = useState([]);
  const [doorDraft, setDoorDraft] = useState({ side: "left", pos: "" });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    let e = {};
    if (!form.length) e.length = "Room length required";
    if (!form.width) e.width = "Room width required";
    if (!form.students || Number(form.students) <= 0)
      e.students = "Valid student count required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- DOORS ---------------- */
  const addDoor = () => {
    if (!doorDraft.pos) return;
    setDoors([...doors, doorDraft]);
    setDoorDraft({ side: "left", pos: "" });
  };

  const removeDoor = (i) =>
    setDoors(doors.filter((_, idx) => idx !== i));

  /* ---------------- GENERATE ---------------- */
  const generatePlan = () => {
    if (!validate()) return;

    setLoading(true);
    setImageUrl(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => (p < 95 ? p + 5 : p));
    }, 120);

    /* 🔮 BACKEND READY (FastAPI / Flask)
    fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, doors })
    })
      .then(res => res.json())
      .then(data => setImageUrl(data.image_url));
    */

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setImageUrl("/classroom_seating.png");
      setLoading(false);
    }, 2200);
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={S.page}>
      <h1 style={S.title}>🏫 Smart Space Management (AI-Driven)</h1>

      <div style={S.grid}>

        {/* LEFT PANEL */}
        <div style={S.panel}>
          <h2>📐 Classroom Configuration</h2>

          <Input
            label="Room Length (m)"
            name="length"
            value={form.length}
            onChange={handleChange}
            error={errors.length}
          />

          <Input
            label="Room Width (m)"
            name="width"
            value={form.width}
            onChange={handleChange}
            error={errors.width}
          />

          <Select
            label="Seating Type"
            name="seatType"
            value={form.seatType}
            onChange={handleChange}
            options={["chair", "bench"]}
          />

          <Input
            label="Number of Students"
            name="students"
            value={form.students}
            onChange={handleChange}
            error={errors.students}
          />

          <Select
            label="Board Position"
            name="boardSide"
            value={form.boardSide}
            onChange={handleChange}
            options={["top", "bottom", "left", "right"]}
          />

          <h3 style={{ marginTop: 18 }}>🚪 Doors</h3>

          <div style={S.row}>
            <select
              style={S.input}
              value={doorDraft.side}
              onChange={(e) =>
                setDoorDraft({ ...doorDraft, side: e.target.value })
              }
            >
              <option>left</option>
              <option>right</option>
              <option>top</option>
              <option>bottom</option>
            </select>

            <input
              style={S.input}
              placeholder="Distance (m)"
              value={doorDraft.pos}
              onChange={(e) =>
                setDoorDraft({ ...doorDraft, pos: e.target.value })
              }
            />

            <button style={S.smallBtn} onClick={addDoor}>＋</button>
          </div>

          {doors.map((d, i) => (
            <div key={i} style={S.doorRow}>
              <span>Door {i + 1}: {d.side} @ {d.pos} m</span>
              <button onClick={() => removeDoor(i)}>✕</button>
            </div>
          ))}

          <button style={S.mainBtn} onClick={generatePlan}>
            Generate Seating Plan
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div style={S.panel}>
          <h2>📊 Generation Output</h2>

          {loading && (
            <>
              <p>AI Optimizing Layout…</p>
              <div style={S.progressBar}>
                <div style={{ ...S.progressFill, width: `${progress}%` }} />
              </div>
            </>
          )}

          {imageUrl && (
            <>
              <img src={imageUrl} alt="Seating Plan" style={S.image} />

              <a href={imageUrl} download>
                <button style={S.downloadBtn}>⬇ Download Layout</button>
              </a>

              <div style={S.summary}>
                <h3>📌 Layout Summary</h3>
                <p>Students: {form.students}</p>
                <p>Seat Type: {form.seatType}</p>
                <p>Board Side: {form.boardSide}</p>
                <p>Doors: {doors.length}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */
const Input = ({ label, error, ...props }) => (
  <>
    <input style={S.input} placeholder={label} {...props} />
    {error && <div style={S.error}>{error}</div>}
  </>
);

const Select = ({ label, options, ...props }) => (
  <select style={S.input} {...props}>
    {options.map(o => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
);

/* ---------------- STYLES ---------------- */
const S = {
  page: {
    minHeight: "200vh",
    padding: "140px",
    color: "#b41132ff",
    fontFamily: "Poppins, Segoe UI",
  },
  title: {
    textAlign: "center",
    marginBottom: "230px",
    color: "#24a826ff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "130px",
  },
  panel: {
    padding: "44px",
    borderRadius: "38px",
    background: "rgba(255,255,255,0.08)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
  },
  input: {
    width: "100%",
    padding: "62px",
    fontSize: "53px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "none",
  },
  row: {
    display: "flex",
    gap: "8px",
    fontSize: "53px",
  },
  smallBtn: {
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "53px",
    cursor: "pointer",
  },
  mainBtn: {
    width: "100%",
    marginTop: "16px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "600",
    background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "53px",
  },
  progressBar: {
    height: "6px",
    background: "#1e293b",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg,#60a5fa,#22d3ee)",
    transition: "width 0.3s",
  },
  image: {
    width: "100%",
    marginTop: "12px",
    borderRadius: "12px",
  },
  downloadBtn: {
    marginTop: "12px",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  summary: {
    marginTop: "14px",
    background: "rgba(255,255,255,0.08)",
    padding: "12px",
    borderRadius: "10px",
  },
  doorRow: {
    display: "flex",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.12)",
    padding: "6px 10px",
    borderRadius: "8px",
    marginBottom: "6px",
  },
  error: {
    color: "#fca5a5",
    fontSize: "13px",
    marginBottom: "6px",
  },
};






