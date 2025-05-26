const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// CORS 허용 (프론트에서 접근 가능하게)
app.use(cors());

// JSON 요청 바디 파싱
app.use(express.json());

// 정적 폴더 제공
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// uploads 폴더 없으면 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// resume 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 이력서 업로드
app.post('/upload', upload.single('resume'), (req, res) => {
  res.send({ filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

// 문의 저장 및 조회용 파일 경로
const DATA_FILE = path.join(__dirname, 'inquiries.json');

// 문의 저장
app.post('/api/inquiries', (req, res) => {
  const newInquiry = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let inquiries = [];
    if (!err && data) {
      inquiries = JSON.parse(data);
    }
    inquiries.push(newInquiry);

    fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2), (err) => {
      if (err) {
        console.error("저장 실패:", err);
        return res.status(500).json({ message: "저장 실패" });
      }
      res.json({ message: "저장 성공" });
    });
  });
});

// 문의 목록 조회
app.get('/api/inquiries', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.json([]);
    const inquiries = JSON.parse(data || '[]');
    res.json(inquiries);
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
