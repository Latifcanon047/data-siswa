"use client"

import { useEffect, useState } from "react";
import Link from "next/link"

type Kelas = {
    id:             number,
    namaKelas:      string,
    waliKelas:      string,
} 

export default function KelasPage() {
    const [kelas, setKelas] = useState<Kelas[]>([]);
    const [namaKelas, setNamaKelas] = useState("");
    const [waliKelas, setWaliKelas] = useState("");
    const [error, setError] = useState("");

    async function loadKelas() {
        const res = await fetch("/api/kelas");
        const data = await res.json();
        setKelas(data);
    }
    
    useEffect(() => {
        loadKelas()
    }) 

    async function handleSubmit() {
        
    }
}