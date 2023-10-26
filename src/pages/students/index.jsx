import React from "react";
import useFetchAllData from "../../hooks/query/useFetchAllData";
import Table from "./components/Table";
import ListData from "./components/ListData";
import Banner from "../../components/Banner";

export default function Students() {
  const students = useFetchAllData("/students");
  const { data, isLoading } = students;

  return (
    <>
      <Banner content={"Siswa"} />
      {data.length !== 0 ? (
        <div className="mx-auto bg-body border rounded mb-5">
          <Table data={data} isLoading={isLoading} RenderComponent={ListData} contentPerPage={10} />
        </div>
      ) : (
        ""
      )}
    </>
  );
}
