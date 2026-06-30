"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// import mahasiswaRoutes from "./routes/mahasiswa.route";
const mahasiswa_db_route_1 = __importDefault(require("./routes/mahasiswa-db.route"));
const prodi_route_1 = __importDefault(require("./routes/prodi.route"));
// app.use("/api/db/mahasiswa", mahasiswaDbRoutes);
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "Backend Express berjalan" });
});
app.use("/api/mahasiswa", mahasiswa_db_route_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use("/api/prodi", prodi_route_1.default);
exports.default = app;
