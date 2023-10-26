import React from "react";
import useFetchAllData from "../../hooks/query/useFetchAllData";
import Banner from "../../components/Banner";

export default function Home() {
  const schoolYears = useFetchAllData("/school_year");
  const { data: schoolYear } = schoolYears;

  const students = useFetchAllData("/students");
  const { data: student } = students;

  const transformData = (array) => {
    const result = array.map((item) => {
      const startDate = new Date(item.start_date);
      const endDate = new Date(item.end_date);
      const dates = [];
      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date).toISOString().split("T")[0]);
      }
      return {
        school_year: item.school_year,
        dates,
      };
    });

    return result;
  };

  function getCurrentSchoolYear(array) {
    const today = new Date().toISOString().split("T")[0];
    for (const item of array) {
      if (item.dates.includes(today)) {
        return item.school_year;
      }
    }
    return "Tidak ada dalam tahun ajaran saat ini";
  }

  // Remove Duplicates Classrooms
  const getClassrooms = (array) => {
    const dataClassrooms = array.map((item) => {
      return item?.classroom;
    });

    let uniqueClassroom = dataClassrooms?.filter((element, index) => {
      return dataClassrooms?.indexOf(element) === index;
    });

    return uniqueClassroom;
  };

  const transformedData = transformData(schoolYear);
  const currentSchoolYear = getCurrentSchoolYear(transformedData);
  const classrooms = getClassrooms(student);

  return (
    <>
      <Banner content={"Dashboard"} />
      <div className="d-flex justify-content-center align-items-center gap-5 my-5">
        <div className="bg-body border rounded text-center p-4">
          <h3>{currentSchoolYear}</h3>
          <p className="m-0">Tahun Ajaran</p>
        </div>
        <div className="bg-body border rounded text-center p-4">
          <h3>{student.length}</h3>
          <p className="m-0">Total Siswa</p>
        </div>
        <div className="bg-body border rounded text-center p-4">
          <h3>{classrooms.length}</h3>
          <p className="m-0">Total Kelas</p>
        </div>
      </div>
    </>
  );
}
