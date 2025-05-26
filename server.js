const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// CORS 허용
app.use(cors());
app.use(express.json());

// 정적 폴더 제공
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// uploads 폴더 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// multer 설정
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
  const resumeInfo = {
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  };

  fs.writeFile(
    path.join(__dirname, 'last_resume.json'),
    JSON.stringify(resumeInfo, null, 2),
    err => {
      if (err) {
        console.error('이력서 정보 저장 실패:', err);
        return res.status(500).json({ message: '파일 저장 오류' });
      }
      res.send(resumeInfo);
    }
  );
});

// 마지막 업로드된 이력서 정보 가져오기
app.get('/last-resume', (req, res) => {
  const filePath = path.join(__dirname, 'last_resume.json');
  if (!fs.existsSync(filePath)) return res.json(null);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: '읽기 실패' });
    res.json(JSON.parse(data));
  });
});

// 문의 저장
const DATA_FILE = path.join(__dirname, 'inquiries.json');

app.post('/api/inquiries', (req, res) => {
  const newInquiry = req.body;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let inquiries = [];
    if (!err && data) inquiries = JSON.parse(data);
    inquiries.push(newInquiry);
    fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2), (err) => {
      if (err) return res.status(500).json({ message: '저장 실패' });
      res.json({ message: '저장 성공' });
    });
  });
});

app.get('/api/inquiries', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.json([]);
    res.json(JSON.parse(data || '[]'));
  });
});

// 프로젝트 목록 조회
app.get('/api/projects', (req, res) => {
  fs.readFile(PROJECT_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: '읽기 실패' });
    res.json(JSON.parse(data || '[]'));
  });
});

// 프로젝트 목록 저장 (전체 교체 방식)
app.post('/api/projects', (req, res) => {
  const projects = req.body;
  fs.writeFile(PROJECT_FILE, JSON.stringify(projects, null, 2), (err) => {
    if (err) return res.status(500).json({ message: '저장 실패' });
    res.json({ message: '저장 성공' });
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});