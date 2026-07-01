import bcrypt from "bcrypt";
import db from "./config/database";

const seedUsers = async () => {
  try {
    const users = [
      { name: "Admin", email: "admin@kampus.ac.id", password: "password123", role: "admin" },
      { name: "Operator", email: "operator@kampus.ac.id", password: "password123", role: "operator" },
      { name: "Viewer", email: "viewer@kampus.ac.id", password: "password123", role: "viewer" }
    ];

    for (const u of users) {
      const hashed = await bcrypt.hash(u.password, 10);
      await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [u.name, u.email, hashed, u.role]
      );
      console.log(`Berhasil insert user: ${u.email} (Role: ${u.role})`);
    }

    console.log("Seeding selesai!");
    process.exit(0);
  } catch (error) {
    console.error("Gagal seed users:", error);
    process.exit(1);
  }
};

seedUsers();
