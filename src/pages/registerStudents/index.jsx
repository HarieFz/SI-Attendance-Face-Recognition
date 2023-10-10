import React from "react";
import useFetchAllData from "../../hooks/query/useFetchAllData";
import Table from "./components/Table";
import ListData from "./components/ListData";

export default function RegisterStudents() {
  const students = useFetchAllData("/students");
  const { data, isLoading } = students;

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : data.length !== 0 ? (
        <div className="mx-auto bg-body border rounded mb-5">
          <Table data={data} RenderComponent={ListData} contentPerPage={10} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
