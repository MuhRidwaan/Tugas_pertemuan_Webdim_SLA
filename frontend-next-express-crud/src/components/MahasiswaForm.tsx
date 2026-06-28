"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mahasiswa, MahasiswaInput } from "@/lib/api";

type Props = {
  selectedMahasiswa: Mahasiswa | null;
  onSubmit: (formData: FormData) => Promise<void>; // Handler sekarang menerima FormData
  onCancelEdit: () => void;
};

const initialForm: MahasiswaInput = {
  nim: "",
  nama: "",
  prodi_id: "", // default kosong
  angkatan: new Date().getFullYear(),
};

export default function MahasiswaForm({
  selectedMahasiswa,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [form, setForm] = useState<MahasiswaInput>(initialForm);
  const [foto, setFoto] = useState<File | null>(null); // State baru untuk handle file foto
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        prodi_id: String(selectedMahasiswa.prodi_id), // mapping prodi_id dari backend
        angkatan: selectedMahasiswa.angkatan,
      });
    } else {
      setForm(initialForm);
      setFoto(null);
    }
  }, [selectedMahasiswa]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Bungkus data text & file ke dalam FormData sebelum dikirim ke API
      const formData = new FormData();
      formData.append("nim", form.nim);
      formData.append("nama", form.nama);
      formData.append("prodi_id", form.prodi_id);
      formData.append("angkatan", String(form.angkatan));

      if (foto) {
        formData.append("foto", foto); // "foto" disamakan dengan uploadFotoMahasiswa.single("foto") di backend
      }

      await onSubmit(formData);
      setForm(initialForm);
      setFoto(null);

      // Reset input file secara manual
      const fileInput = document.getElementById("foto") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      encType="multipart/form-data"
    >
      <h2>{selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h2>

      <div className="grid">
        <div className="form-group">
          <label htmlFor="nim">NIM</label>
          <input
            id="nim"
            value={form.nim}
            onChange={(e) => setForm({ ...form, nim: e.target.value })}
            placeholder="Contoh: 2201001"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nama">Nama</label>
          <input
            id="nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Nama mahasiswa"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prodi_id">ID Prodi</label>
          <input
            id="prodi_id"
            type="number"
            value={form.prodi_id}
            onChange={(e) => setForm({ ...form, prodi_id: e.target.value })}
            placeholder="Contoh: 1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="angkatan">Angkatan</label>
          <input
            id="angkatan"
            type="number"
            value={form.angkatan}
            onChange={(e) =>
              setForm({ ...form, angkatan: Number(e.target.value) })
            }
            required
          />
        </div>

        {/* Input file baru untuk upload foto */}
        <div className="form-group">
          <label htmlFor="foto">Foto Mahasiswa</label>
          <input
            id="foto"
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      <div className="actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Menyimpan..." : selectedMahasiswa ? "Update" : "Simpan"}
        </button>

        {selectedMahasiswa && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancelEdit}
          >
            Batal Edit
          </button>
        )}
      </div>
    </form>
  );
}
