import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    show: false,
    title: "",
    description: "",
    route: ""
  });

  const handleNavClick = (title, description, route) => {
    setInfo({ show: true, title, description, route });

    setTimeout(() => {
      setInfo({ show: false, title: "", description: "", route: "" });
      navigate(route);
    }, 1800);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="xp-navbar">

        {/* LOGO */}
        <div
          className="xp-logo"
          onClick={() =>
            handleNavClick(
              "Vistar Netra",
              "AI-powered Smart Campus Management Platform integrating academics, administration, safety, and analytics into one unified system.",
              "/"
            )
          }
        >
          Vistar Netra
        </div>

        {/* CENTER GRID MENU */}
        <ul className="xp-links">
          <li onClick={() =>
            handleNavClick(
              "Homepage",
              "Centralized dashboard providing complete institutional overview, alerts, analytics and quick access to all modules.",
              "/"
            )
          }>Home</li>

          <li onClick={() =>
            handleNavClick(
              "Campus Vistara system",
              "Smart campus infrastructure, classroom allocation, labs, utilities and resource utilization monitoring.",
              "/space"
            )
          }> Campus Vistara </li>

          <li onClick={() =>
            handleNavClick(
              "College Netra",
              "AI-based campus surveillance system for safety, monitoring, restricted zones and incident alerts.",
              "/surveillance"
            )
          }>College Netra</li>

          <li onClick={() =>
            handleNavClick(
              "Student Mitra",
              "Student mentoring, academic intelligence, guidance system and performance insights.",
              "/CircuAIApp"
            )
          }> Student Mitra</li>

          <li onClick={() =>
            handleNavClick(
              "Timetable Generator",
              "Automatic AI-powered timetable creation with conflict-free scheduling and faculty optimization.",
              "/TimetableFrontend"
            )
          }>Smart Timetable </li>

          <li onClick={() =>
            handleNavClick(
              "Docu AI",
              "Digital document automation for notices, reports, approvals and institutional records.",
              "/notifications"
            )
          }>Docu AI</li>

          <li onClick={() =>
            handleNavClick(
              "DIGI NOTICE",
              "Smart circular creation, scheduling and campus-wide notification engine.",
              "/settings"
            )
          }>DIGI NOTICE</li>

                <li onClick={() =>
            handleNavClick(
              "Attendance Insight Engine",
              "Advanced attendance analytics to detect risks, trends and compliance gaps.",
               "student-attendance-analytics"
            )
          }> Student Academic Health engine</li>

          <li onClick={() =>
            handleNavClick(
              "Student Fee & Attendance Intelligence",
      "Integrated financial and attendance analytics to identify dues, risks, and academic impact.",
              "/student-fee-attendance"
            )
          }>Student Fee Intelligent System</li>

          <li onClick={() =>
            handleNavClick(
              "Smart Invigilation Allocator",
              "Automated exam invigilation duty allocation ensuring fairness and conflict-free planning.",
              "/smart-invigilator"
            )
          }> Smart Invigilator Allocation Engine</li>

          <li onClick={() =>
            handleNavClick(
              "Feedback Intelligence",
              "AI-powered feedback analysis converting student opinions into actionable insights.",
              "/faculty-feedback"
            )
          }>Faculty Feedback Intelligence System</li>
        </ul>

        {/* RIGHT AREA (PROFILE PLACEHOLDER) */}
        <div className="xp-right">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="xp-profile"
          />
        </div>
      </nav>

      {/* ================= INFO OVERLAY ================= */}
      {info.show && (
        <div className="info-overlay">
          <div className="info-card">
            <h2>{info.title}</h2>
            <p>{info.description}</p>
            <div className="info-loader"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

