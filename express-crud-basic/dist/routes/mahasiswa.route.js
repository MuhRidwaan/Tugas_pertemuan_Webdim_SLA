"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mahasiswa_data_1 = require("../data/mahasiswa.data");
const router = (0, express_1.Router)();
// READ ALL
router.get("/", (req, res) => {
    res.json({
        message: "Data mahasiswa berhasil diambil",
        data: mahasiswa_data_1.mahasiswa,
    });
});
// READ DETAIL
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const data = mahasiswa_data_1.mahasiswa.find((item) => item.id === id);
    if (!data) {
        return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }
    res.json({
        message: "Detail mahasiswa berhasil diambil",
        data,
    });
});
// CREATE
router.post("/", (req, res) => {
    const { nim, nama, prodi, angkatan } = req.body;
    if (!nim || !nama || !prodi || !angkatan) {
        return res.status(400).json({
            message: "NIM, nama, prodi, dan angkatan wajib diisi",
        });
    }
    const newMahasiswa = {
        id: mahasiswa_data_1.mahasiswa.length + 1,
        nim,
        nama,
        prodi,
        angkatan: Number(angkatan),
    };
    mahasiswa_data_1.mahasiswa.push(newMahasiswa);
    res.status(201).json({
        message: "Mahasiswa berhasil ditambahkan",
        data: newMahasiswa,
    });
});
// UPDATE
router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { nim, nama, prodi, angkatan } = req.body;
    const index = mahasiswa_data_1.mahasiswa.findIndex((item) => item.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }
    mahasiswa_data_1.mahasiswa[index] = {
        id,
        nim,
        nama,
        prodi,
        angkatan: Number(angkatan),
    };
    res.json({
        message: "Mahasiswa berhasil diperbarui",
        data: mahasiswa_data_1.mahasiswa[index],
    });
});
// DELETE
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = mahasiswa_data_1.mahasiswa.findIndex((item) => item.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }
    const deletedData = mahasiswa_data_1.mahasiswa.splice(index, 1);
    res.json({
        message: "Mahasiswa berhasil dihapus",
        data: deletedData[0],
    });
});
exports.default = router;
