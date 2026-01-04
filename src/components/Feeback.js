import React, { useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from "recharts";


/* ================= CONFIG ================= */
const faculty_ids = Array.from({ length: 20 }, (_, i) => `F${100 + i}`);

const subjects = [
  "Python","AI","ML","Cloud","DSA","DBMS","Networks","Cybersecurity",
  "OS","Maths","Data Science","Big Data","IOT","Robotics",
  "Deep Learning","NLP","Compiler Design","Web Dev","Java","C Programming"
];

const facultySubjectMap = {};
faculty_ids.forEach((f, i) => (facultySubjectMap[f] = subjects[i]));

const domains = [
  "concept_explanation","real_life_examples","pace","doubt_handling",
  "clarity","language_clarity","interaction","communication",
  "knowledge_depth","industry_relevance","updated_content",
  "time_management","discipline_control","ppt_quality","assignment_quality"
];

const rand = (min, max) =>
  +(Math.random() * (max - min) + min).toFixed(2);

/* ================= COMPONENT ================= */
const FacultyFeedbackEngine = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  /* -------- DATA SIMULATION (AI OUTPUT) -------- */
  const facultyData = useMemo(() => {
    return faculty_ids.map(fid => {
      let domainScores = {};
      domains.forEach(d => (domainScores[d] = rand(2.2, 4.8)));

      const avg =
        Object.values(domainScores).reduce((a, b) => a + b, 0) /
        domains.length;

      return {
        faculty_id: fid,
        subject: facultySubjectMap[fid],
        positive: Math.round(rand(55, 85)),
        neutral: Math.round(rand(10, 30)),
        negative: Math.round(rand(5, 20)),
        domainScores,
        avgScore: +avg.toFixed(2),
      };
    });
  }, []);

  /* -------- PIE DATA -------- */
  const pieData = facultyData.map(f => ({
    name: f.faculty_id,
    value: f.avgScore,
  }));

  /* -------- SUGGESTIONS (PYTHON faculty_suggestions) -------- */
  const getSuggestions = faculty => {
    const weak = Object.entries(faculty.domainScores)
      .filter(([_, v]) => v < 3.0)
      .map(([k]) => k.replace(/_/g, " "));

    return weak.length === 0
      ? ["✔ No improvement required. Faculty performing well."]
      : weak.map(w => `⚠ ${w} needs improvement`);
  };

  return (
    <div className="ffe-container">
      <h1>📊 Faculty Feedback Engine</h1>

      {/* ========== PIE CHART ========== */}
      <div style={{ height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              onClick={(_, index) =>
                setSelectedFaculty(facultyData[index])
              }
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={`hsl(${i * 18},70%,55%)`} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <p style={{ textAlign: "center", opacity: 0.8 }}>
          👉 Click on any faculty to view complete analysis report
        </p>
      </div>

      {/* ========== DETAILED FACULTY REPORT ========== */}
      {selectedFaculty && (
        <div className="explain-panel">
          <h2>🧑‍🏫 Faculty Analysis Report</h2>

          <p><b>Faculty ID:</b> {selectedFaculty.faculty_id}</p>
          <p><b>Subject:</b> {selectedFaculty.subject}</p>

          <p>
            😊 {selectedFaculty.positive}% &nbsp;
            😐 {selectedFaculty.neutral}% &nbsp;
            ☹ {selectedFaculty.negative}%
          </p>

          <h3>📌 Domain-wise Performance</h3>

          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart
                data={Object.entries(selectedFaculty.domainScores).map(
                  ([k, v]) => ({ domain: k, score: v })
                )}
              >
                <XAxis dataKey="domain" hide />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="score" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h3>⚠ Improvement Suggestions</h3>
          <ul>
            {getSuggestions(selectedFaculty).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h3>🏆 Overall Score: {selectedFaculty.avgScore}</h3>

          <button onClick={() => setSelectedFaculty(null)}>
            Close Report
          </button>
        </div>
      )}
    </div>
  );
};

export default FacultyFeedbackEngine;

