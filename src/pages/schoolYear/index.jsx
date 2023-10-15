import React from "react";
import useFetchAllData from "../../hooks/query/useFetchAllData";
import Table from "./components/Table";
import ListData from "./components/ListData";

export default function SchoolYear() {
  const schoolYear = useFetchAllData("/school_year");
  const { data, isLoading } = schoolYear;

  console.log(data);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="mx-auto bg-body border rounded mb-5">
          <Table data={data} RenderComponent={ListData} contentPerPage={10} />
        </div>
      )}
    </>
  );
}
