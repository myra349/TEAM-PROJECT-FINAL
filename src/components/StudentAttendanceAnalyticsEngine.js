import React, { useMemo, useState } from "react";

/* ================= HELPERS ================= */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const firstNames = ["Aarav","Vihaan","Aditya","Arjun","Rahul","Rohan","Karthik","Neeraj","Manoj","Siddharth"];
const lastNames = ["Reddy","Kumar","Sharma","Verma","Naidu","Singh","Patel","Gupta","Iyer","Kapoor"];

const randomName = () =>
  `${firstNames[rand(0, firstNames.length - 1)]} ${lastNames[rand(0, lastNames.length - 1)]}`;

/* ================= GENERATE 100 STUDENTS ================= */
const generateStudents = () =>
  Array.from({ length: 100 }, (_, i) => ({
    id: `S${String(i + 1).padStart(3, "0")}`,
    name: randomName(),
    attendance: rand(55, 95),
    gpa: +(5 + Math.random() * 4.5).toFixed(2),
    backlogs: rand(0, 3),
    semester: rand(3, 8),
    mid: rand(15, 30),
    final: rand(45, 90),
    extracurricular: rand(0, 10),
    interest: ["ML", "Web", "Cloud", "AI", "DS"][rand(0, 4)]
  }));

/* ================= ANALYSIS ENGINE ================= */
const analyzeStudent = (s) => {
  let risk = 0;
  let reasons = [];

  if (s.attendance < 70) { risk += 30; reasons.push("low attendance"); }
  if (s.gpa < 6.5) { risk += 25; reasons.push("low GPA"); }
  if (s.backlogs >= 2) { risk += 25; reasons.push("multiple backlogs"); }
  if (s.final < 55) { risk += 20; reasons.push("poor final exam performance"); }

  let level =
    risk >= 70 ? "High" :
    risk >= 40 ? "Medium" : "Low";

  return {
    risk,
    level,
    description:
      `${s.name} shows ${reasons.join(", ") || "good academic consistency"}. 
       Based on attendance, GPA, exams and backlog history, this student requires ${level.toLowerCase()} academic attention.`,
    major: s.interest === "ML" ? "Machine Learning" :
           s.interest === "Web" ? "Full Stack Development" :
           s.interest === "Cloud" ? "Cloud Computing" :
           s.interest === "AI" ? "Artificial Intelligence" :
           "Data Science",
    minor: level === "High" ? "Programming Fundamentals" :
           level === "Medium" ? "Problem Solving Lab" :
           "Advanced Skill Course"
  };
};

/* ================= COMPONENT ================= */
export default function StudentAttendanceAnalyticsEngine() {
  const [students, setStudents] = useState(generateStudents());
  const [selected, setSelected] = useState(null);
  const [newName, setNewName] = useState("");

  const summary = useMemo(() => {
    let high = 0, medium = 0, low = 0;
    students.forEach(s => {
      const { level } = analyzeStudent(s);
      if (level === "High") high++;
      else if (level === "Medium") medium++;
      else low++;
    });
    return { high, medium, low };
  }, [students]);

  const addStudent = () => {
    if (!newName.trim()) return;
    setStudents([
      ...students,
      {
        id: `S${String(students.length + 1).padStart(3, "0")}`,
        name: newName,
        attendance: 65,
        gpa: 6.2,
        backlogs: 1,
        semester: 5,
        mid: 25,
        final: 55,
        extracurricular: 4,
        interest: "Web"
      }
    ]);
    setNewName("");
  };

  return (
    <div className="engine">
      <h1>📊 Student Attendance & Risk Intelligence</h1>

      {/* SUMMARY */}
      <div className="summary">
        <div className="box high">High Risk<br />{summary.high}</div>
        <div className="box medium">Medium Risk<br />{summary.medium}</div>
        <div className="box low">Low Risk<br />{summary.low}</div>
      </div>

      {/* ADD STUDENT */}
      <div className="add">
        <input
          placeholder="Add new student name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={addStudent}>Add Student</button>
      </div>

      {/* STUDENT LIST */}
      <div className="grid">
        {students.map(s => {
          const a = analyzeStudent(s);
          return (
            <div
              key={s.id}
              className={`card ${a.level}`}
              onClick={() => setSelected({ ...s, analysis: a })}
            >
              <h3>{s.name}</h3>
              <p>ID: {s.id}</p>
              <p>Attendance: {s.attendance}%</p>
              <p>Risk: <b>{a.level}</b></p>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="modal">
          <div className="modal-box">
            <h2>{selected.name}</h2>
            <p>{selected.analysis.description}</p>

            <div className="courses">
              <div className="major">🎓 Major<br />{selected.analysis.major}</div>
              <div className="minor">🛠 Minor<br />{selected.analysis.minor}</div>
            </div>

            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .engine{
          min-height:100vh;
          padding:30px;
          background:#0f172a;
          color:#e5e7eb;
          font-family:Poppins;
        }
        h1{text-align:center;color:#93c5fd;font-size:38px}
        .summary{
          display:flex;
          justify-content:center;
          gap:20px;
          margin:20px 0;
        }
        .box{
          padding:18px 30px;
          border-radius:18px;
          font-size:22px;
          text-align:center;
        }
        .high{background:#7f1d1d}
        .medium{background:#78350f}
        .low{background:#064e3b}

        .add{
          display:flex;
          justify-content:center;
          gap:12px;
          margin-bottom:25px;
        }
        input{
          padding:12px;
          width:300px;
          border-radius:12px;
          border:none;
          background:#1e293b;
          color:white;
        }
        button{
          padding:12px 24px;
          border:none;
          border-radius:12px;
          background:#2563eb;
          color:white;
          cursor:pointer;
        }

        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
          gap:20px;
        }
        .card{
          background:#020617;
          padding:18px;
          border-radius:18px;
          cursor:pointer;
          transition:.3s;
        }
        .card:hover{
          transform:translateY(-6px);
          box-shadow:0 0 25px rgba(59,130,246,.5);
        }
        .card.High{border-left:6px solid #ef4444}
        .card.Medium{border-left:6px solid #facc15}
        .card.Low{border-left:6px solid #22c55e}

        .modal{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.6);
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .modal-box{
          background:#020617;
          padding:30px;
          width:520px;
          border-radius:22px;
        }
        .courses{
          display:flex;
          gap:20px;
          margin:18px 0;
        }
        .major,.minor{
          flex:1;
          padding:16px;
          border-radius:16px;
          text-align:center;
        }
        .major{background:#2563eb}
        .minor{background:#16a34a}
      `}</style>
    </div>
  );
}
