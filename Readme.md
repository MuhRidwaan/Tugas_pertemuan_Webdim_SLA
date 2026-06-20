# CRUD API Mahasiswa - Express.js & Next.js

## Deskripsi

Project ini merupakan tugas mandiri yang dibuat untuk mempelajari implementasi CRUD (Create, Read, Update, Delete) menggunakan Express.js sebagai backend API dan Next.js sebagai frontend.

Aplikasi ini memungkinkan pengguna untuk mengelola data mahasiswa, mulai dari menambahkan data, melihat daftar mahasiswa, melihat detail mahasiswa, mengubah data, hingga menghapus data.

## Teknologi yang Digunakan

### Backend

- Express.js
- TypeScript
- MySQL
- mysql2
- CORS

### Frontend

- Next.js
- React
- TypeScript

## Fitur

- Menampilkan daftar mahasiswa
- Menampilkan detail mahasiswa
- Menambahkan data mahasiswa
- Mengubah data mahasiswa
- Menghapus data mahasiswa
- Integrasi frontend dan backend menggunakan REST API

## Struktur Project

```text
SLA/
├── express-crud-basic/         # Backend Express.js
└── frontend-next-express-crud/ # Frontend Next.js
```

## Endpoint API

| Method | Endpoint    | Deskripsi                                 |
| ------ | ----------- | ----------------------------------------- |
| GET    | /mahasiswa  | Mengambil seluruh data mahasiswa          |
| GET    | /mahasiswa/ | Mengambil detail mahasiswa berdasarkan ID |
| POST   | /mahasiswa  | Menambahkan data mahasiswa                |
| PUT    | /mahasiswa/ | Mengubah data mahasiswa                   |
| DELETE | /mahasiswa/ | Menghapus data mahasiswa                  |

## Menjalankan Backend

```bash
cd express-crud-basic
npm install
npm run dev
```

## Menjalankan Frontend

```bash
cd frontend-next-express-crud -- -p 3001
npm install
npm run dev
```

## Tujuan Pembelajaran

Project ini dibuat sebagai sarana pembelajaran untuk memahami:

- REST API menggunakan Express.js
- Operasi CRUD pada database MySQL
- Penggunaan TypeScript pada backend dan frontend
- Integrasi Next.js dengan Express.js
- Pengelolaan data menggunakan HTTP Request

## Author

M Ridwan
Teknik Informatika
