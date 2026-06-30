import express from "express";
import cors from "cors";
import path from "path";
// import mahasiswaRoutes from "./routes/mahasiswa.route";
import mahasiswaDbRoutes from "./routes/mahasiswa-db.route";
import prodiRoutes from "./routes/prodi.route";
import authRoutes from "./routes/auth.route";

import { authMiddleware } from "./middlewares/auth.middleware";
import { getAllMahasiswa } from "./controllers/mahasiswa.controller";


// app.use("/api/db/mahasiswa", mahasiswaDbRoutes);

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend Express berjalan" });
});

app.use("/api/mahasiswa", authMiddleware, mahasiswaDbRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/prodi", prodiRoutes);
app.use("/api/auth", authRoutes);



export default app;
