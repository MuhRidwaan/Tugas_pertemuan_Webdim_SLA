import { Router } from "express";
import { allowRoles } from "../middlewares/role.middleware";
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";
import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", allowRoles("admin", "operator", "viewer"), getAllMahasiswa);
router.post(
  "/",
  allowRoles("admin", "operator"),
  uploadFotoMahasiswa.single("foto"),
  createMahasiswa
);
router.put(
  "/:id",
  allowRoles("admin", "operator"),
  uploadFotoMahasiswa.single("foto"),
  updateMahasiswa
);
router.delete("/:id", allowRoles("admin"), deleteMahasiswa);

export default router;
