// server.js (Node.js + Express)
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// 폴더 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 정적 파일 제공
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// 파일 업로드 라우터
app.post('/upload', upload.single('resume'), (req, res) => {
  res.send({ filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});