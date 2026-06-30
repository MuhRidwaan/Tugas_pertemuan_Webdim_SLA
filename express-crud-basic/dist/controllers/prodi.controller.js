"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProdi = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllProdi = async (req, res) => {
    try {
        const [rows] = await database_1.default.query("SELECT id, nama_prodi FROM prodi ORDER BY nama_prodi ASC");
        res.json({
            message: "Data prodi berhasil diambil",
            data: rows,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
exports.getAllProdi = getAllProdi;
