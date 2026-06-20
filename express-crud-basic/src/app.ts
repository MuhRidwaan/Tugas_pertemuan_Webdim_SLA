import express from "express";
import cors from "cors";
// import mahasiswaRoutes from "./routes/mahasiswa.route";
import mahasiswaDbRoutes from "./routes/mahasiswa-db.route";

// app.use("/api/db/mahasiswa", mahasiswaDbRoutes);

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend Express berjalan" });
});

app.use("/api/mahasiswa", mahasiswaDbRoutes);

export default app;
