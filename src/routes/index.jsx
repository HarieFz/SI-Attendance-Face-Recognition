import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login/Login";
import ProtectedUser from "./user/ProtectedUser";
import PrivateUser from "./user/PrivateUser";
import AttendanceRoom from "../pages/attendanceRoom";
import SchoolYear from "../pages/schoolYear";
import AddCourse from "../pages/addCourse";
import Students from "../pages/students";

export default function SetupRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedUser />}>
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="/" element={<PrivateUser />}>
          <Route index element={<Home />} />
          <Route path="register-students" element={<Students />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="attendance" element={<AttendanceRoom />} />
          <Route path="school-year" element={<SchoolYear />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
