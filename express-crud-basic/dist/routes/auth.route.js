"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const mahasiswa_controller_1 = require("../controllers/mahasiswa.controller");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, mahasiswa_controller_1.getAllMahasiswa);
exports.default = router;
