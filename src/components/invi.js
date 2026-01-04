import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";

/* ================= DATA ================= */
const facultyNames = [
  "Dr. Ramesh Kumar","Dr. Suresh Rao","Dr. Anil Sharma","Dr. Kiran Patel","Dr. Venkatesh Naidu",
  "Dr. Mahesh Reddy","Dr. Sunitha Devi","Dr. Prakash Mehta","Dr. Ravi Teja","Dr. Sumanth Varma",
  "Dr. Lakshmi Narayana","Dr. Harsha Vardhan","Dr. Pooja Singh","Dr. Nikhil Jain","Dr. Aparna Iyer",
  "Dr. Naveen Chandra","Dr. Priya Malhotra","Dr. Arjun Verma","Dr. Sneha Kulkarni","Dr. Rohit Agarwal",
  "Dr. Deepak Mishra","Dr. Kavitha Rao","Dr. Sanjay Gupta","Dr. Meena Iyer","Dr. Karthik Subramaniam",
  "Dr. Anusha Reddy","Dr. Vikram Singh","Dr. Bhavya Shah","Dr. Sateesh Babu","Dr. Neha Kapoor"
];

/* ================= INITIAL FACULTY ================= */
const initialFaculty = facultyNames.map((name, i) => ({
  id: `T${i + 1}`,
  name,
}));

/* ================= ROOMS ================= */
const rooms = Array.from({ length: 60 }, (_, i) => `Room ${101 + i}`);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/* ================= COMPONENT ================= */
const SmartInvigilatorEngine = () => {
  const [facultyList, setFacultyList] = useState(initialFaculty);
  const [newFaculty, setNewFaculty] = useState("");
  const [day, setDay] = useState("Mon");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  /* ===== Allocation ===== */
  const allocation = useMemo(() => {
    let index = DAYS.indexOf(day) * 2;
    return rooms.map(room => {
      const assigned = [];
      for (let i = 0; i < 2; i++) {
        if (facultyList[index]) {
          assigned.push({
            ...facultyList[index],
            session: i === 0 ? "Morning" : "Afternoon",
          });
          index++;
        }
      }
      return { room, teachers: assigned };
    });
  }, [facultyList, day]);

  /* ===== Faculty Analysis ===== */
  const facultyAnalysis = useMemo(() => {
    const map = {};
    facultyList.forEach(f => (map[f.id] = { ...f, count: 0 }));

    allocation.forEach(a =>
      a.teachers.forEach(t => {
        if (t) map[t.id].count++;
      })
    );
    return Object.values(map);
  }, [allocation, facultyList]);

  /* ===== PDF ===== */
  const downloadRoomPDF = () => {
    const doc = new jsPDF();
    doc.text(`Room Allocation – ${day}`, 14, 15);
    let y = 25;
    allocation.forEach(a => {
      doc.text(a.room, 14, y); y += 6;
      a.teachers.length
        ? a.teachers.forEach(t => {
            doc.text(`- ${t.name} (${t.session})`, 20, y);
            y += 6;
          })
        : doc.text("Faculty will be replaced soon", 20, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save(`Room_Allocation_${day}.pdf`);
  };

  const downloadFacultyPDF = () => {
    const doc = new jsPDF();
    doc.text("Faculty Load Analysis", 14, 15);
    let y = 25;
    facultyAnalysis.forEach(f => {
      doc.text(`${f.name} – Duties: ${f.count}`, 14, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save("Faculty_Load_Report.pdf");
  };

  return (
    <div className="sie">
      <h1>🛡 Smart Invigilator Allocation Dashboard</h1>

      {/* TOP BAR */}
      <div className="top-bar">
        {DAYS.map(d => (
          <button
            key={d}
            className={day === d ? "active" : ""}
            onClick={() => setDay(d)}
          >
            {d}
          </button>
        ))}
        <button onClick={downloadRoomPDF}>📄 EXAM HALL INFO PDF</button>
        <button onClick={downloadFacultyPDF}>📄 FACULTY  INVILIZATION STATUS PDF</button>
      </div>

      <div className="layout">
        {/* FACULTY PANEL */}
        <div className="faculty-panel">
          <h2>👨‍🏫 Faculty ({facultyList.length})</h2>

          <input
            placeholder="Add Faculty"
            value={newFaculty}
            onChange={e => setNewFaculty(e.target.value)}
          />
          <button
            onClick={() => {
              if (!newFaculty.trim()) return;
              setFacultyList([
                ...facultyList,
                { id: `T${facultyList.length + 1}`, name: newFaculty },
              ]);
              setNewFaculty("");
            }}
          >
            Add
          </button>

          {facultyAnalysis.map(f => (
            <div
              key={f.id}
              className={`faculty-card ${f.count > 2 ? "over" : ""}`}
              onClick={() => setSelectedTeacher(f)}
            >
              <span>{f.name}</span>
              <span className="count">{f.count}</span>
            </div>
          ))}
        </div>

        {/* ROOMS */}
        <div className="room-panel">
          <h2>🏫 EXAM HALL ({rooms.length})</h2>
          <div className="room-grid">
            {allocation.map((a, i) => (
              <div
                key={i}
                className={`room-card ${a.teachers.length < 2 ? "pending" : ""}`}
                onClick={() => setSelectedRoom(a)}
              >
                {a.room}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {selectedRoom && (
        <div className="modal">
          <div className="modal-box">
            <h2>{selectedRoom.room}</h2>
            {selectedRoom.teachers.length
              ? selectedRoom.teachers.map(t => (
                  <p key={t.id}>{t.name} – {t.session}</p>
                ))
              : <p>⏳ Faculty replacement in progress</p>}
            <button onClick={() => setSelectedRoom(null)}>Close</button>
          </div>
        </div>
      )}

      {selectedTeacher && (
        <div className="modal">
          <div className="modal-box">
            <h2>{selectedTeacher.name}</h2>
            <p>Invigilation Duties: {selectedTeacher.count}</p>
            <button onClick={() => setSelectedTeacher(null)}>Close</button>
          </div>
        </div>
      )}

      {/* ================= CSS ================= */}
      <style>{`
        .sie{
          min-height:200vh;
          padding:30px;
          background:radial-gradient(circle at top,#020617,#000);
          color:#e5e7eb;
          font-family:Poppins, sans-serif;
        }

        h1{
          text-align:center;
          font-size:42px;
          margin-bottom:20px;
          color:#7dd3fc;
          text-shadow:0 0 25px rgba(56,189,248,.6);
        }

        .top-bar{
          text-align:center;
          margin-bottom:20px;
        }

        .top-bar button{
          margin:10px;
          gap:15px;
          padding:18px 18px;
          font-size:42px;
          border-radius:28px;
          border:none;
          cursor:pointer;
          background:#1e293b;
          color:#e5e7eb;
        }

        .top-bar .active{
          background:linear-gradient(90deg,#2563eb,#38bdf8);
        }

        .layout{
          display:flex;
          gap:45px;
        }

        /* FACULTY */
        .faculty-panel{
          width:620px;
          background:rgba(255,255,255,0.05);
          border-radius:22px;
          font-size:60px;
          padding:16px;
          backdrop-filter:blur(14px);
        }

        .faculty-panel input{
          width:100%;
          padding:16px;
         font-size:57px;
          margin-bottom:10px;
          border-radius:14px;
          border:none;
          color:white;
        }

        .faculty-panel button{
          width:100%;
        font-size:47px;
          margin-bottom:14px;
        }

        .faculty-card{
          background:#1e293b;
          padding:12px;
          margin-bottom:10px;
          border-radius:16px;
          display:flex;
          justify-content:space-between;
          font-size:47px;
          cursor:pointer;
          transition:.25s;
        }
         /* ===== FACULTY CARD ===== */


/* ===== FACULTY CARD ===== */


        /* ROOMS */
        .room-panel{
          flex:1;
          background:rgba(255,255,255,0.04);
          border-radius:22px;
          padding:5px;
        }

        .room-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(850px,2fr));
          gap:20px;
        }

        .room-card{
          background:#334155;
          padding:22px;
          border-radius:18px;
          text-align:center;
          font-size:45px;
          cursor:pointer;
          transition:.3s;
        }

        .room-card:hover{
          transform:translateY(-6px);
          box-shadow:0 0 30px rgba(14,165,233,.5);
        }

        .room-card.pending{
          border:2px dashed #eef4f6ff;
          color:cyan;
        }

        /* MODAL */
        .modal{
          position:fixed;
          inset:0;
          background:rgba(1, 0, 10, 0.65);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:999;
        }

        .modal-box{
          background:#020617;
          padding:30px;
          border-radius:26px;
          width:860px;
          text-align:center;
          box-shadow:0 0 45px rgba(59,130,246,.6);
        }

        .modal-box p{
          font-size:60px;
          margin:10px 0;
        }

        .modal-box button{
          margin-top:20px;
          padding:12px 30px;
          font-size:45px;
          border-radius:20px;
          border:none;
          background:linear-gradient(90deg,#2563eb,#38bdf8);
          color:white;
          cursor:pointer;
        }
      `}</style>
    </div>
  );
};

export default SmartInvigilatorEngine;
