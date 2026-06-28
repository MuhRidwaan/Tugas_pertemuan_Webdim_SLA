import { Request, Response } from "express";
import db from "../config/database";
import fs from "fs";
import path from "path";

export const getAllMahasiswa = async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || "");
    const prodiId = req.query.prodi_id ? Number(req.query.prodi_id) : null;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 5, 1);
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      where += " AND (m.nim LIKE ? OR m.nama LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (prodiId) {
      where += " AND m.prodi_id = ?";
      params.push(prodiId);
    }

    const [countRows]: any = await db.query(
      `SELECT COUNT(*) AS total FROM mahasiswa m ${where}`,
      params,
    );

    const total = countRows[0].total;

    const [rows] = await db.query(
      `SELECT
        m.id,
        m.nim,
        m.nama,
        m.angkatan,
        m.foto,
        p.id AS prodi_id,
        p.nama_prodi
      FROM mahasiswa m
      JOIN prodi p ON m.prodi_id = p.id
      ${where}
      ORDER BY m.id DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    res.json({
      message: "Data mahasiswa berhasil diambil",
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const createMahasiswa = async (req: Request, res: Response) => {
  try {
    const { nim, nama, prodi_id, angkatan } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!nim || !nama || !prodi_id || !angkatan) {
      return res.status(400).json({
        message: "NIM, nama, prodi, dan angkatan wajib diisi",
      });
    }

    const [existing]: any = await db.query(
      "SELECT id FROM mahasiswa WHERE nim = ?",
      [nim],
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "NIM sudah digunakan" });
    }

    const [result]: any = await db.query(
      `INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto)
       VALUES (?, ?, ?, ?, ?)`,
      [nim, nama, Number(prodi_id), Number(angkatan), foto],
    );

    res.status(201).json({
      message: "Mahasiswa berhasil ditambahkan",
      data: { id: result.insertId, nim, nama, prodi_id, angkatan, foto },
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updateMahasiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nim, nama, prodi_id, angkatan } = req.body;

    const fields = ["nim = ?", "nama = ?", "prodi_id = ?", "angkatan = ?"];
    const values: any[] = [nim, nama, Number(prodi_id), Number(angkatan)];

    if (req.file) {
      fields.push("foto = ?");
      values.push(req.file.filename);
    }

    values.push(id);

    const [result]: any = await db.query(
      `UPDATE mahasiswa SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    res.json({ message: "Mahasiswa berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const deleteMahasiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Ambil nama file foto dari database terlebih dahulu sebelum dihapus
    const [rows]: any = await db.query(
      "SELECT foto FROM mahasiswa WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    const foto = rows[0].foto;

    // 2. Hapus data mahasiswa dari database
    const [result]: any = await db.query("DELETE FROM mahasiswa WHERE id = ?", [
      id,
    ]);

    // 3. Jika data di DB berhasil didelete, hapus fisik fotonya jika ada
    if (result.affectedRows > 0 && foto) {
      // Sesuaikan path 'public/uploads' dengan folder tempat lo nyimpen multer destination ya bro!
      const filePath = path.join(__dirname, "../../public/uploads", foto);

      // Cek apakah file benar-benar ada di storage, lalu hapus
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch (error) {
    console.error(error); // Biar gampang debug kalau ada error di terminal
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
