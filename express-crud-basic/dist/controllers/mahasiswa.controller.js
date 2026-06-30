"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.deleteMahasiswa = exports.updateMahasiswa = exports.createMahasiswa = exports.getAllMahasiswa = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAllMahasiswa = async (req, res) => {
    try {
        const search = String(req.query.search || "");
        const prodiId = req.query.prodi_id ? Number(req.query.prodi_id) : null;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 5, 1);
        const offset = (page - 1) * limit;
        let where = "WHERE 1=1";
        const params = [];
        if (search) {
            where += " AND (m.nim LIKE ? OR m.nama LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }
        if (prodiId) {
            where += " AND m.prodi_id = ?";
            params.push(prodiId);
        }
        const [countRows] = await database_1.default.query(`SELECT COUNT(*) AS total FROM mahasiswa m ${where}`, params);
        const total = countRows[0].total;
        const [rows] = await database_1.default.query(`SELECT
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
      LIMIT ? OFFSET ?`, [...params, limit, offset]);
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
    }
    catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
exports.getAllMahasiswa = getAllMahasiswa;
const createMahasiswa = async (req, res) => {
    try {
        const { nim, nama, prodi_id, angkatan } = req.body;
        const foto = req.file ? req.file.filename : null;
        if (!nim || !nama || !prodi_id || !angkatan) {
            return res.status(400).json({
                message: "NIM, nama, prodi, dan angkatan wajib diisi",
            });
        }
        const [existing] = await database_1.default.query("SELECT id FROM mahasiswa WHERE nim = ?", [nim]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "NIM sudah digunakan" });
        }
        const [result] = await database_1.default.query(`INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto)
       VALUES (?, ?, ?, ?, ?)`, [nim, nama, Number(prodi_id), Number(angkatan), foto]);
        res.status(201).json({
            message: "Mahasiswa berhasil ditambahkan",
            data: { id: result.insertId, nim, nama, prodi_id, angkatan, foto },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
exports.createMahasiswa = createMahasiswa;
const updateMahasiswa = async (req, res) => {
    try {
        const { id } = req.params;
        const { nim, nama, prodi_id, angkatan } = req.body;
        const fields = ["nim = ?", "nama = ?", "prodi_id = ?", "angkatan = ?"];
        const values = [nim, nama, Number(prodi_id), Number(angkatan)];
        if (req.file) {
            fields.push("foto = ?");
            values.push(req.file.filename);
        }
        values.push(id);
        const [result] = await database_1.default.query(`UPDATE mahasiswa SET ${fields.join(", ")} WHERE id = ?`, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
        }
        res.json({ message: "Mahasiswa berhasil diperbarui" });
    }
    catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
exports.updateMahasiswa = updateMahasiswa;
const deleteMahasiswa = async (req, res) => {
    try {
        const { id } = req.params;
        // 1. Ambil nama file foto dari database terlebih dahulu sebelum dihapus
        const [rows] = await database_1.default.query("SELECT foto FROM mahasiswa WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
        }
        const foto = rows[0].foto;
        // 2. Hapus data mahasiswa dari database
        const [result] = await database_1.default.query("DELETE FROM mahasiswa WHERE id = ?", [
            id,
        ]);
        // 3. Jika data di DB berhasil didelete, hapus fisik fotonya jika ada
        if (result.affectedRows > 0 && foto) {
            // Sesuaikan path 'public/uploads' dengan folder tempat lo nyimpen multer destination ya bro!
            const filePath = path_1.default.join(__dirname, "../../public/uploads", foto);
            // Cek apakah file benar-benar ada di storage, lalu hapus
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        res.json({ message: "Mahasiswa berhasil dihapus" });
    }
    catch (error) {
        console.error(error); // Biar gampang debug kalau ada error di terminal
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
exports.deleteMahasiswa = deleteMahasiswa;
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Nama, email, dan password wajib diisi",
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password minimal 6 karakter",
            });
        }
        const [existing] = await database_1.default.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await database_1.default.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, "viewer"]);
        res.status(201).json({ message: "Registrasi berhasil" });
    }
    catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi",
            });
        }
        const [rows] = await database_1.default.query("SELECT id, name, email, password, role FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        const user = rows[0];
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || "2h") });
        res.json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
exports.login = login;
