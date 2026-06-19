"use client";
import { clear } from "console";
import { useState, useEffect } from "react";

export default function NilaiClient() {
  interface Kelas {
    id: number;
    namaKelas: string;
    waliKelas: string;
  }

  interface Mapel {
    id: number;
    namaMapel: string;
  }

  interface Nilai {
    id: number;
    nilai: number;
  }

  interface AllData {
    siswaId: number;
    nilaiId: number | null;
    nilai: number | null;
    nama: string;
    nis: number;
    kelas: Kelas;
  }

  const [dataSiswa, setDataSiswa] = useState<AllData[] | null>(null);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [kelasId, setKelasId] = useState<number>(0);
  const [mapelId, setMapelId] = useState<number>(0);
  const [siswaId, setSiswaId] = useState<number | null>(null);
  const [idNilai, setIdNilai] = useState<number | null>(null);
  const [namaSiswa, setNamaSiswa] = useState<string>("");
  const [nilai, setNilai] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  async function loadData() {
    setLoading(true);
    setError("");

    if (!mapelId || !kelasId) {
      setError("pilih Kelas dan mata pelajaran terbelih dahulu");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `api/nilai?kelasId=${kelasId}&mapelId=${mapelId}`,
      );
      const data = await res.json();
      setDataSiswa(data);
    } catch {
      setError("Pilih dulu kelas dan mata pelajaran");
    } finally {
      setLoading(false);
      setError("");
    }
  }

  async function loadIds() {
    setLoading(true);
    try {
      const [kelasres, mapelres] = await Promise.all([
        fetch(`api/kelas`),
        fetch(`api/mapel`),
      ]);
      const kelasData = await kelasres.json();
      const mapelData = await mapelres.json();

      setKelas(kelasData);
      setMapel(mapelData);
    } catch {
      console.log("gagal bre");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: number | null) {
    setUpdate(true);
    setError("");

    if (!mapelId || !kelasId) {
      setError("Pilih Kelas Dan Mata Pelajaran Terbelih Dahulu");
      setUpdate(false);
      return;
    }

    if (id) {
      const res = await fetch(`/api/nilai/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nilai }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.log(data);
        setOpenModal(false);
        setError(data.error);
        setUpdate(false);
        return;
      }
      setUpdate(false);
      setOpenModal(false);
      loadData();
      return;
    }

    const res = await fetch("api/nilai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siswaId, kelasId, mapelId, nilai }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      setUpdate(false);
      setOpenModal(false);
      return;
    }
  }

  useEffect(() => {
    loadIds();
  }, []);

  return (
    <div
      className="pt-12 md: p-0"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #1f2937, #0b0f19)",
        padding: 20,
        paddingTop: 80,
      }}
    >
      <div style={{ width: "100%", maxWidth: 1100 }}>
        <div
          style={{
            textAlign: "center",
            padding: 20,
            marginBottom: 20,
            borderRadius: 18,
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          <h2 style={{ margin: 0, color: "#fff", fontSize: 30 }}>
            Form Nilai Siswa
          </h2>
        </div>

        <div
          style={{
            background: "rgba(17,24,39,0.85)",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              marginBottom: 20,
              padding: 12,
              borderRadius: 12,
              background: "rgba(34,197,94,0.08)",
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#fff" }}>Kelas</span>
              <select
                value={kelasId}
                onChange={(e) => setKelasId(Number(e.target.value))}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "#111827",
                  color: "#fff",
                  border: "1px solid rgba(34,197,94,0.4)",
                  outline: "none",
                }}
              >
                <option value="">Pilih Kelas</option>
                {kelas?.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.namaKelas}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#fff" }}>Mapel</span>
              <select
                value={mapelId}
                onChange={(e) => setMapelId(Number(e.target.value))}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "#111827",
                  color: "#fff",
                  border: "1px solid rgba(34,197,94,0.4)",
                  outline: "none",
                }}
              >
                <option value="">Pilih Mapel</option>
                {mapel?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.namaMapel}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => loadData()}
              style={{
                marginLeft: "auto",
                padding: "10px 16px",
                borderRadius: 10,
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 6px 15px rgba(34,197,94,0.25)",
              }}
            >
              Cari Data
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 700,
              }}
            >
              <thead>
                <tr style={{ background: "#22c55e", color: "#fff" }}>
                  {["No", "Nama", "NIS", "Nilai"].map((h) => (
                    <th key={h} style={{ padding: 14, textAlign: "left" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody style={{ color: "#e5e7eb" }}>
                {!error &&
                  dataSiswa?.map((s, i) => (
                    <tr
                      key={s.siswaId}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <td style={{ padding: 14 }}>{i + 1}</td>
                      <td style={{ padding: 14 }}>{s.nama}</td>
                      <td style={{ padding: 14 }}>{s.nis}</td>
                      <td
                        onClick={() => {
                          setNamaSiswa(s.nama);
                          setNilai(s.nilai ? s.nilai : 0);
                          setIdNilai(s.nilaiId ? s.nilaiId : null);
                          setSiswaId(s.siswaId);
                          setOpenModal(true);
                        }}
                        style={{
                          padding: 14,
                          color: "#22c55e",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {s.nilai ? s.nilai : 0}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {(dataSiswa?.length === 0 || !dataSiswa) && !error && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: " center",
                  padding: 10,
                }}
              >
                <div style={{ fontSize: 25, color: "white" }}>
                  Belum ada data
                </div>
              </div>
            )}
            {error !== "" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: " center",
                  padding: 10,
                }}
              >
                <div style={{ fontSize: 25, color: "red" }}>{error}</div>
              </div>
            )}
          </div>
        </div>

        {openModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 380,
                background: "#111827",
                borderRadius: 16,
                padding: 20,
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#fff",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Edit Nilai</h3>
              <p>{namaSiswa}</p>

              <input
                type="number"
                value={nilai ? nilai : ""}
                onChange={(e) => setNilai(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid rgba(34,197,94,0.4)",
                  background: "#0f172a",
                  color: "#fff",
                  marginBottom: 15,
                  outline: "none",
                }}
              />

              <button
                onClick={() => handleUpdate(idNilai)}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  border: "none",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
