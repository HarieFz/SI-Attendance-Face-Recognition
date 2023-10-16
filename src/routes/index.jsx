import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login/Login";
import ProtectedUser from "./user/ProtectedUser";
import PrivateUser from "./user/PrivateUser";
import AttendanceRoom from "../pages/attendanceRoom";
import RegisterStudents from "../pages/registerStudents";
import SchoolYear from "../pages/schoolYear";
import FormAddCourse from "../pages/addCourse/FormAddCourse";

export default function SetupRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedUser />}>
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="/" element={<PrivateUser />}>
          <Route index element={<Home />} />
          <Route path="register-students" element={<RegisterStudents />} />
          <Route path="add-course" element={<FormAddCourse />} />
          <Route path="attendance" element={<AttendanceRoom />} />
          <Route path="school-year" element={<SchoolYear />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
