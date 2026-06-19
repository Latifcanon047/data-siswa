"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditSiswaPage() {
   const router = useRouter();
   const params = useParams();
   const id = params?.id as string;

   const [nama, setNama] = useState("");
   const [nis, setNis] = useState("");
   const [alamat, setAlamat] = useState("")
   const [error, setError] = useState("");
  // State loading untuk memberikan jeda visual saat aplikasi sedang mengambil data dari server
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (!id) return;
      fetch(`/api/students/${id}`)
      .then((r) => {
         if (!r.ok) {
            throw new Error ("Gagal mengambil data siswa/siswi."); 
         } return r.json();
      })
      .then((data) => {
         setNama(data.nama || "");
         setNis(data.nis || "");
         setAlamat(data.alamat || "");
         setLoading(false);
      })
       .catch((err) => {
         setError(err.message);
         setLoading(false);
       });
   }, [id]);

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError("");
     
      try {
         const res = await fetch(`/api/students/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama, nis, alamat}),
         });

         if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Gagal memperbarui data.");
            return;
         }

         router.push("/students");
         router.refresh();
      } catch {
         setError("Terjadi kesalahan jaringan.");
      }
   }

   if (loading) return <p>Sabar YAA.............</p>;

   return (
      <div>
         <div className="nav">
            <Link href="/students"> Balik </Link>
         </div>

         <h1> Edit Siswa/Siswi </h1>
         <br />

         <form onSubmit={handleSubmit}>
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
      </div>
   )
}