"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import AdminSidebar from "./components/AdminSidebar";
import OverviewCards from "./components/OverviewCards";
import RecentEnrollments from "./components/RecentEnrollments";
import StudentList from "./components/StudentList";
import AddStudentForm from "./components/AddStudentForm";
import VideoList from "./components/VideoList";
import AddVideoForm from "./components/AddVideoForm";
import CourseList from "./components/CourseList";
import AddCourseForm from "./components/AddCourseForm";

const ADMIN_EMAIL = "admin@stitching.com";

export type Section =
  | "overview"
  | "add-student"
  | "students"
  | "add-video"
  | "videos"
  | "add-course"
  | "courses";

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [checking, setChecking] = useState(true);

  // guard — only admin can access
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push("/adminlogin");
      } else {
        setChecking(false);
      }
    };
    checkAdmin();
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#1A1208", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", color: "#B45309", marginBottom: "12px" }}>✦</div>
          <p style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#78716C" }}>Verifying Access…</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (section) {
      case "overview":
        return (
          <>
            <OverviewCards />
            <RecentEnrollments />
          </>
        );
      case "students":
        return <StudentList onAddNew={() => setSection("add-student")} />;
      case "add-student":
        return <AddStudentForm onSuccess={() => setSection("students")} onCancel={() => setSection("students")} />;
      case "videos":
        return <VideoList onAddNew={() => setSection("add-video")} />;
      case "add-video":
        return <AddVideoForm onSuccess={() => setSection("videos")} onCancel={() => setSection("videos")} />;
      case "courses":
        return <CourseList onAddNew={() => setSection("add-course")} />;
      case "add-course":
        return <AddCourseForm onSuccess={() => setSection("courses")} onCancel={() => setSection("courses")} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", fontFamily: "'Georgia','Times New Roman',serif", display: "flex" }}>

      {/* Sidebar */}
      <AdminSidebar active={section} onNavigate={setSection} />

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Top bar */}
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EDE8E0", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#B45309", marginBottom: "2px" }}>
              Admin Panel
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: 400, color: "#1A1208", margin: 0 }}>
              {section === "overview"     && "Dashboard Overview"}
              {section === "students"     && "All Students"}
              {section === "add-student"  && "Add New Student"}
              {section === "videos"       && "All Videos"}
              {section === "add-video"    && "Add New Video"}
              {section === "courses"      && "All Courses"}
              {section === "add-course"   && "Add New Course"}
            </h1>
          </div>
          <div style={{ fontSize: "12px", color: "#A8A29E", fontStyle: "italic" }}>
            ✦ Stitching Excellence
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "32px" }}>
          {renderSection()}
        </div>

        {/* Footer */}
        <footer style={{ textAlign: "center", padding: "16px 24px", borderTop: "1px solid #EDE8E0", background: "#FFFFFF", color: "#C4B89A", fontSize: "12px", letterSpacing: "0.15em" }}>
          ✦ Admin Panel — Stitching Excellence ✦
        </footer>

      </div>
    </div>
  );
}