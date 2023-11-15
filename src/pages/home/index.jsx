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
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
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
      <Banner>Dashboard</Banner>
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

      <div className="bg-body border rounded p-5">
        <p>Selamat Datang</p>
        <div style={{ textAlign: "justify" }}>
          Sistem ini adalah sistem akademik untuk melakukan proses absensi di
          SMA Negeri Cimanggung.
          <br />
          Langkah-langkah dalam menggunakan sistem ini sebagai berikut :
          <ol>
            <li>
              Isi Tahun Ajaran pada menu <u>Lainnya</u>
            </li>
            <li>
              Isi Data Siswa pada menu <u>Siswa</u>
            </li>
            <li>
              Buat Pertemuan pada menu <u>Absensi</u> kemudian pilih Tahun
              Ajaran sekarang, Tanggal hari ini, dan Kelas. Setelah itu klik
              tombol Lanjutkan
            </li>
            <li>
              Setelah klik tombol Lanjutkan maka akan menuju halaman Absensi
              dimana ditampilkan rekap absen siswa dengan kelas yang dipilih dan
              tombol buka webcam
            </li>
            <ul>
              <li>
                Tombol buka webcam berfungsi untuk mengaktifkan kamera dan
                melakukan Face Recognition kepada wajah siswa yang telah
                didaftarkan data-nya, dimana ketika wajah siswa terdeteksi maka
                akan otomatis memperbarui rekap absen yang ada di samping kiri
                kamera.
              </li>
              <li>
                Pada rekap absen terdapat tombol ubah yaitu untuk menyunting
                keterangan kehadiran siswa jika siswa tidak hadir. Juga pada
                rekap absen terdapat tombol untuk mengirimkan SMS ke Orang Tua
                Siswa, dimana fungsi dari tombol tersebut untuk mengirim SMS ke
                Orang Tua ketika Siswa yang bersangkutan Alpa.
              </li>
            </ul>
            <li>
              Adapun menu Rekap Absensi dalam 1 semester terdapat pada menu{" "}
              <u>Lainnya</u>. Dimana, terdapat filter Tahun Ajaran ke berapa dan
              Kelas apa yang ingin ditampilkan rekap absensinya. Pada menu Rekap
              Absensi juga terdapat tombol untuk mengunduh rekap absensi ke
              dalam bentuk Excel
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
