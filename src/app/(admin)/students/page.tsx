"use client";
import { useEffect, useState } from "react"
import Link from "next/link";

type Siswa = {
   id: number;
   nama: string;
   nis: string;
   alamat: string;
};
export default function SiswaPage() {
   const [siswa, setSiswa] = useState<Siswa[]>([]);
   const [nama, setNama] = useState("");
   const [nis, setNis] = useState("");
   const [alamat, setAlamat] = useState("");
   const [error, setError] = useState("");

   async function loadSiswa() {
      const res = await fetch('/api/students');
      const data = await res.json();
      setSiswa(data);
   }

   useEffect(() => {
      const init = async () => {
         await loadSiswa();
      };
      init();
   }, []);

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError("");

      const res = await fetch("/api/students", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ nama, nis, alamat }),
      });

      if (!res.ok) {
         const data = await res.json();
         setError(data.error);
         return;
      }
      setNama("");
      setNis("");
      setAlamat("");
      loadSiswa();
   }
   async function handleDelete(id: number) {
      if (!confirm("Yakin ingin menghapus siswa/siswi ini?")) return;
      await fetch(`/api/students/${id}` , { method: "DELETE" });
      loadSiswa();
   }

   return (
    <div>
      <div className="nav">
        <Link href="/">← Beranda</Link>
      </div>

      <h1>Data Siswa</h1>
      <br />
      {/* Menghubungkan event submit form ke fungsi handleSubmit yang sudah dibuat di atas */}
      <form onSubmit={handleSubmit}>
        {/* Kondisi jika state 'error' berisi teks (tidak kosong), maka tampilkan pesan error dalam tag paragraf */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
         <input 
            placeholder="Nama" 
            value={nama} 
            onChange={(e) => setNama(e.target.value)}
            required 
         />
         <input 
            placeholder="NIS" 
            value={nis} 
            onChange={(e) => setNis(e.target.value)} 
            required 
         />
         <input
            placeholder="Alamat" 
            value={alamat} 
            onChange={(e) => setAlamat(e.target.value)} 
            required 
         />
        {/* Tombol submit yang memicu jalannya event onSubmit pada tag form di atas */}
        <button type="submit">Simpan</button>
      </form>

      <br/>

      <h2>Daftar Siswa</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>NIS</th>
            <th>Alamat</th>
          </tr>
        </thead>
        <tbody>
          {/* Melakukan perulangan (mapping) untuk setiap objek siswa 's' di dalam array 'students' */}
          {siswa.map((item) => (
            // Atribut 'key' wajib ada pada React element hasil looping untuk mengidentifikasi baris secara unik via ID
            <tr key={item.id}>
              <td>{item.nama}</td>
              <td>{item.nis}</td>
              <td>{item.alamat}</td>
              <td>
                <Link href={`/students/${item.id}`} style={{ marginRight: '8px', color: 'blue' }}>Edit</Link>
                {/* Tombol hapus yang memicu fungsi handleDelete dengan mengirimkan ID siswa saat ini */}
                <button onClick={() => handleDelete(item.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}