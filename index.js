const readXlsxFile = require("read-excel-file/node");

let fileInputAkademik = document.getElementById("fileInputakademik");
let resTableAkademik = document.getElementById("result_akademik");
let search_top_akademik = document.getElementById("search_top_akademik");

let searchby = "";
let fileInputAkademikCSVSrc = null;
let BestSiswaAkademik = [];

document
  .getElementById("search_absen_akademik")
  .addEventListener("click", () => {
    SearchData();
  });

search_top_akademik.addEventListener("change", function (props) {
  searchby = props.target.value;
});

fileInputAkademik.addEventListener("change", function (props) {
  fileInputAkademikCSVSrc = props?.target?.files[0]?.path;
  // searchby = 1;
  readFileAkademik();
});

function readFileAkademik() {
  readXlsxFile(fileInputAkademikCSVSrc).then((rows) => {
    let siswa = [];
    rows.forEach((item, idx) => {
      if (idx !== 0) {
        let nama = item[1];
        let sum = 0;
        let total_matkul = 0;
        let matkul_dan_nilai = [];
        item.forEach((data_per_rows, idx_data_per_rows) => {
          if (idx_data_per_rows !== 0 && idx_data_per_rows !== 1) {
            sum += data_per_rows;
            total_matkul += 1;

            matkul_dan_nilai.push({
              matkul: rows[0]?.[idx_data_per_rows],
              nilai: data_per_rows,
            });
          }
        });
        let rata_rata_nilai = sum / total_matkul;
        siswa.push({
          no: idx,
          nama: nama,
          matkul: matkul_dan_nilai,
          total_matkul: total_matkul,
          rata_rata_nilai: rata_rata_nilai,
        });
      }
    });
    BestSiswaAkademik = siswa;
    // SearchData();
  });
}

function SearchData() {
  let siswa = BestSiswaAkademik.filter(
    (siswa) => siswa.no.toString() === searchby
  )[0];
  console

  let rankSelectedSiswa = 1;
  BestSiswaAkademik.forEach((item) => {
    if (siswa.rata_rata_nilai < item.rata_rata_nilai) {
      rankSelectedSiswa += 1;
    } else if (siswa.rata_rata_nilai == item.rata_rata_nilai) {
      rankSelectedSiswa -= 1;
    }
  });

  let htmlCode = ``;

  htmlCode += `
          <tr>
            <th scope="row">Nama</th>
            <td colspan="2" class="table-active">${siswa.nama}</td>
          </tr>`;

  siswa.matkul.forEach((matkul) => {
    htmlCode += `
            <tr>
              <th scope="row">Mata pelajaran ${matkul?.matkul}</th>
              <td colspan="2" class="table-active">${matkul?.nilai}</td>
            </tr>
          `;
  });

  htmlCode += `
            <tr>
              <th scope="row">Nilai rata-rata</th>
              <td colspan="2" class="table-active">${siswa.rata_rata_nilai}</td>
            </tr>
            <tr>
              <th scope="row">Rank</th>
              <td colspan="2" class="table-active">${rankSelectedSiswa}</td>
            </tr>
          `;
  resTableAkademik.innerHTML = htmlCode;
}

// nonakademik =================================================================

let fileInputNonAkademik = document.getElementById("fileInputnonakademik");
let searchbynonakademik = "";
let fileInputnonAkademikCSVSrc = null;
let BestSiswaNonAkademik = [];
let search_nisn_akademik = document.getElementById("search_top_nonakademik");
let select_nisn_nonAkademik = document.getElementById("search_top_nonakademik")
let resTableNonAkademik = document.getElementById("result_nonakademik");
fileInputNonAkademik.addEventListener("change", async function (props) {
  fileInputnonAkademikCSVSrc = props?.target?.files[0]?.path;
  readFileNonAkademik()
});

document
  .getElementById("search_nisn_nonakademik")
  .addEventListener("click", () => {
    SearchDataNonAkademik();
  });
search_nisn_akademik.addEventListener("change", function (props) {
  searchbynonakademik = props.target.value;
});

function readFileNonAkademik() {
 
  readXlsxFile(fileInputnonAkademikCSVSrc).then((rows) => {
 
  
    // getting idx position
    let indexing = {
      nama: 0,
      nis: 0,
      nisn: 0,
      jenis_kegiatan: 0,
      prestasi: 0,
      individu_kelompok: 0,
      penyelenggara: 0,
      waktu_kegiatan: 0,
      tingkat: 0
    }
    rows?.[0]?.forEach((item, idx) => {
      console.log(item)
      if (item?.toLowerCase() === "nama siswa"){
        indexing.nama = idx
      }
      if (item?.toLowerCase() === "nisn"){
        indexing.nisn = idx
      }
      if (item?.toLowerCase() === "nis"){
        indexing.nis = idx
      }
      if (item?.toLowerCase() === "jenis kegiatan"){
        indexing.jenis_kegiatan = idx
      }
      if (item?.toLowerCase() === "prestasi"){
        indexing.prestasi = idx
      }
      if (item?.toLowerCase() === "individu / kelompok"){
        indexing.individu_kelompok = idx
      }
      if (item?.toLowerCase() === "waktu kegiatan"){
        indexing.waktu_kegiatan = idx
      }
      if (item?.toLowerCase() === "tingkat"){
        indexing.tingkat = idx
      }
      if (item?.toLowerCase() === "penyelenggara"){
        indexing.penyelenggara === idx
      }
    })
    
    rows.forEach((item, idx) => {
      if (idx !== 0) {

        // get juara
        let juara_value_fixed = {
          '1': 3,
          '2': 2,
          '3': 1 
        }
        let juara_value = 0
        if (item[indexing.prestasi]?.toLowerCase()?.includes('juara ')){
          let get_juara = item[indexing.prestasi]?.toLowerCase()?.split('juara ')?.[1]?.split(' ')?.[0]
          juara_value = juara_value_fixed[get_juara]
        }
        // get tingkat
        let tingkat_value = 0
        let tingkatLowerCase = item[indexing.tingkat]?.toLowerCase()
        function getTingkatValue(tingkat){
          if (tingkat?.includes('kecamatan')) return 5
          if (tingkat?.includes('kabupaten')) return 10
          if (tingkat?.includes('provinsi')) return 30
          if (tingkat?.includes('nasional')) return 50
          if (tingkat?.includes('international')) return 100
        }
        tingkat_value = getTingkatValue(tingkatLowerCase) 

        // set grade
        function getGrade(juara_number, tingkat_number){
          let total = juara_number + tingkat_number
          if (total > 15){
            return 'A'
          }else if (total <= 15){
            return 'B'
          }else if (total < 10 & total > 5){
            return 'C'
          }else if (total < 5){
            return 'D'
          }
        }

        let grade = getGrade(juara_value, tingkat_value)

        BestSiswaNonAkademik.push({
          nama: item[indexing.nama],
          nis: item[indexing.nis],
          nisn: item[indexing.nisn],
          jenis_kegiatan: item[indexing.jenis_kegiatan],
          prestasi: item[indexing.prestasi],
          individu_kelompok: item[indexing.individu_kelompok],
          penyelenggara: item[indexing.penyelenggara],
          tingkat: item[indexing.tingkat],
          juara_value: juara_value,
          tingkat_value: tingkat_value,
          grade: grade
        })    
      }
    });
    
  });
}

function SearchDataNonAkademik() {
  console.log(BestSiswaNonAkademik, searchbynonakademik)
  let siswa = BestSiswaNonAkademik.filter(
    (siswa) => siswa.nisn.toString() === searchbynonakademik?.toString()
  )[0];

  let htmlCode = ``;

  htmlCode += `
          <tr>
            <th scope="row">Nama</th>
            <td colspan="2" class="table-active">${siswa.nama}</td>
          </tr>
          <tr>
            <th scope="row">NIS</th>
            <td colspan="2" class="table-active">${siswa.nis}</td>
          </tr>
          <tr>
            <th scope="row">NISN</th>
            <td colspan="2" class="table-active">${siswa.nisn}</td>
          </tr>
          <tr>
            <th scope="row">Individu / Kelompok</th>
            <td colspan="2" class="table-active">${siswa.individu_kelompok}</td>
          </tr>
          <tr>
            <th scope="row">Jenis Kegiatan</th>
            <td colspan="2" class="table-active">${siswa.jenis_kegiatan}</td>
          </tr>
          <tr>
            <th scope="row">Prestasi</th>
            <td colspan="2" class="table-active">${siswa.prestasi}</td>
          </tr>
          <tr>
            <th scope="row">Tingkat</th>
            <td colspan="2" class="table-active">${siswa.tingkat}</td>
          </tr>
          <tr>
            <th scope="row">Grade</th>
            <td colspan="2" class="table-active">${siswa.grade}</td>
          </tr>`;

  resTableNonAkademik.innerHTML = htmlCode;
}