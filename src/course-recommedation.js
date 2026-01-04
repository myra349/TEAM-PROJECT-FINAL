import React, { useState } from "react";

/* ===== NAME GENERATOR ===== */
const firstNames = [
  "Aarav","Vihaan","Aditya","Arjun","Rahul","Rohan","Karthik","Neeraj","Manoj","Siddharth",
  "Priya","Ananya","Kavya","Sneha","Pooja","Ritika","Shruti","Anjali","Deepika","Sakshi"
];
const lastNames = [
  "Reddy","Kumar","Sharma","Verma","Naidu","Singh","Patel","Gupta","Iyer","Kapoor",
  "Rao","Prasad","Joshi","Mehta","Bose","Nair"
];
const randName = () =>
  `${firstNames[Math.floor(Math.random()*firstNames.length)]} ${
    lastNames[Math.floor(Math.random()*lastNames.length)]
  }`;

/* ===== COURSE CATALOG ===== */
const COURSES = {
  major: ["Machine Learning","Web Development","Cloud Computing","Data Science"],
  minor: ["Programming Fundamentals","Maths Refresher","Problem Solving Lab"]
};

/* ===== GENERATE 100 STUDENTS ===== */
const generateStudents = () =>
  Array.from({ length: 100 }, (_, i) => ({
    id: `S${String(i + 1).padStart(3, "0")}`,
    name: randName(),
    attendance_percent: Math.floor(55 + Math.random() * 45),
    mid_sum: Math.floor(20 + Math.random() * 20),
    final: Math.floor(45 + Math.random() * 35),
    cumulative_gpa: +(5 + Math.random() * 4.5).toFixed(2),
    backlogs: Math.floor(Math.random() * 4),
    extracurricular_score: Math.floor(Math.random() * 10),
    semester: Math.floor(3 + Math.random() * 6),
    interest: COURSES.major[Math.floor(Math.random() * COURSES.major.length)],
  }));

/* ===== ANALYSIS LOGIC ===== */
const analyzeStudent = (s) => {
  let reasons = [];
  if (s.attendance_percent < 70) reasons.push("low attendance");
  if (s.cumulative_gpa < 6.5) reasons.push("low GPA");
  if (s.backlogs >= 2) reasons.push("multiple backlogs");

  let attention =
    reasons.length >= 2 ? "High Attention" :
    reasons.length === 1 ? "Medium Attention" :
    "Low Attention";

  return {
    attention,
    description: `${s.name} shows ${
      reasons.join(", ") || "strong academic performance"
    }. Based on attendance, GPA, backlogs and semester, ${attention.toLowerCase()} is required.`,
    majorCourse: s.interest,
    minorCourse: reasons.length ? "Programming Fundamentals" : "Advanced Skill Course"
  };
};

const StudentAcademicIntelligence = () => {
  const [students, setStudents] = useState(generateStudents());
  const [selected, setSelected] = useState(null);
  const [newName, setNewName] = useState("");

  const addStudent = () => {
    if (!newName.trim()) return;
    setStudents([
      ...students,
      {
        id: `S${String(students.length + 1).padStart(3, "0")}`,
        name: newName,
        attendance_percent: 65,
        mid_sum: 30,
        final: 55,
        cumulative_gpa: 6.2,
        backlogs: 1,
        extracurricular_score: 4,
        semester: 5,
        interest: "Web Development"
      }
    ]);
    setNewName("");
  };

  return (
    <div className="sai-app">
      <h1>📊 Student Academic Intelligence Dashboard</h1>

      {/* COURSE CATALOG */}
      <div className="card section">
        <h2>📚 Course Catalog</h2>
        <p><b>Major:</b> {COURSES.major.join(", ")}</p>
        <p><b>Minor:</b> {COURSES.minor.join(", ")}</p>
      </div>

      {/* ADD STUDENT */}
      <div className="card section">
        <h2>➕ Add Student</h2>
        <div className="add-row">
          <input
            placeholder="Enter student name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={addStudent}>Add</button>
        </div>
      </div>

      {/* STUDENT LIST */}
      <div className="card section">
        <h2>👨‍🎓 Students ({students.length})</h2>
        <div className="student-list">
          {students.map(s => (
            <div
              key={s.id}
              className="student-card"
              onClick={() => setSelected(s)}
            >
              {s.name}
            </div>
          ))}
        </div>
      </div>

      {/* ANALYSIS */}
      {selected && (() => {
        const res = analyzeStudent(selected);
        return (
          <div className="card section analysis">
            <h2>🧠 Detailed Analysis</h2>
            <p className="desc">{res.description}</p>

            <div className="recommend">
              <div className="major">
                🎓 <b>Major Course</b><br />{res.majorCourse}
              </div>
              <div className="minor">
                🛠 <b>Minor Course</b><br />{res.minorCourse}
              </div>
            </div>

            <div className={`attention ${res.attention.split(" ")[0]}`}>
              {res.attention}
            </div>
          </div>
        );
      })()}

      {/* ===== CSS ===== */}
      <style>{`
        body{margin:0}
        .sai-app{
          min-height:100vh;
          padding:30px;
          background:#0f172a;
          color:#e5e7eb;
          font-family:Poppins,sans-serif;
        }
        h1{text-align:center;font-size:40px;color:#93c5fd;margin-bottom:30px}
        h2{color:#7dd3fc;margin-bottom:12px}
        .card{
          background:#020617;
          border-radius:22px;
          padding:22px;
          margin-bottom:22px;
          box-shadow:0 10px 30px rgba(0,0,0,.4);
        }
        .add-row{display:flex;gap:12px}
        input{
          flex:1;padding:12px;border-radius:12px;border:none;
          background:#1e293b;color:white;font-size:16px
        }
        button{
          padding:12px 22px;border:none;border-radius:12px;
          background:#2563eb;color:white;font-size:16px;cursor:pointer
        }
        .student-list{display:flex;gap:14px;flex-wrap:wrap}
        .student-card{
          background:#1e293b;padding:14px 22px;border-radius:16px;
          cursor:pointer;transition:.25s;font-size:17px
        }
        .student-card:hover{
          transform:translateY(-4px);
          box-shadow:0 0 20px rgba(59,130,246,.5)
        }
        .analysis .desc{font-size:17px;line-height:1.6}
        .recommend{display:flex;gap:20px;margin:18px 0}
        .major,.minor{
          flex:1;padding:18px;border-radius:18px;font-size:18px
        }
        .major{background:linear-gradient(135deg,#2563eb,#38bdf8)}
        .minor{background:linear-gradient(135deg,#16a34a,#4ade80)}
        .attention{
          margin-top:14px;padding:14px;border-radius:16px;
          text-align:center;font-size:20px;font-weight:600
        }
        .attention.High{background:#7f1d1d;color:#fecaca}
        .attention.Medium{background:#78350f;color:#fde68a}
        .attention.Low{background:#064e3b;color:#bbf7d0}
      `}</style>
    </div>
  );
};

export default StudentAcademicIntelligence;
