"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  getProdi,
  Mahasiswa,
  Prodi,
  updateMahasiswa,
} from "@/lib/api";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // State untuk Search, Filter, & Pagination
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [page, setPage] = useState(1);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // Ambil data mahasiswa dengan query params
      const dataMhs = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit: 5,
      });
      setMahasiswa(dataMhs);

      // Ambil data prodi untuk dropdown
      const dataProdi = await getProdi();
      setProdiList(dataProdi);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // Efek memicu reload data saat search, filter prodi, atau halaman bergeser
  useEffect(() => {
    loadData();
  }, [search, prodiId, page]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setMessage("");
      setError("");

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setMessage("Data mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(formData);
        setMessage("Data mahasiswa berhasil ditambahkan");
      }

      setSelectedMahasiswa(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteMahasiswa(id);
      setMessage("Data mahasiswa berhasil dihapus");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>Frontend Next.js yang terhubung ke backend Express.js.</p>
        </div>
        <Link href="/">
          <button className="btn-secondary">Kembali</button>
        </Link>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <MahasiswaForm
        selectedMahasiswa={selectedMahasiswa}
        prodiList={prodiList}
        onSubmit={handleSubmit}
        onCancelEdit={() => setSelectedMahasiswa(null)}
      />

      <section className="card" style={{ marginTop: 20 }}>
        <h2>Daftar Mahasiswa</h2>

        {/* BAR DATA FILTER & SEARCH */}
        <div className="grid" style={{ marginBottom: 15, gap: "10px" }}>
          <input
            type="text"
            placeholder="Cari NIM atau Nama..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={prodiId}
            onChange={(e) => {
              setProdiId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">-- Semua Prodi --</option>
            {prodiList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama_prodi}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <>
            <MahasiswaTable
              mahasiswa={mahasiswa}
              onEdit={setSelectedMahasiswa}
              onDelete={handleDelete}
            />

            {/* INTEGRASI PAGINATION */}
            <div
              className="actions"
              style={{ marginTop: 15, justifyContent: "center" }}
            >
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary"
              >
                Prev
              </button>
              <span style={{ alignSelf: "center", margin: "0 10px" }}>
                Halaman {page}
              </span>
              <button
                disabled={mahasiswa.length < 5}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
