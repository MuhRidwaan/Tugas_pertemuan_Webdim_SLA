"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prodi_controller_1 = require("../controllers/prodi.controller");
const router = (0, express_1.Router)();
router.get("/", prodi_controller_1.getAllProdi);
exports.default = router;
