const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'results.json');
const TEST_FILE = path.join(__dirname, 'tests', 'axborot_test.doc');

app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/tests', express.static(path.join(__dirname, 'tests')));

// File upload support
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'tests') });

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ groups: {} }, null, 2), 'utf8');
  }
}

function readResults() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function saveResults(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/group-results', (req, res) => {
  const data = readResults();
  res.json(data.groups || {});
});

// Return available test files
app.get('/api/tests', (req, res) => {
  try {
    const files = fs.readdirSync(path.join(__dirname, 'tests'))
      .filter(f => !f.startsWith('.'));
    res.json({ files });
  } catch (err) {
    res.json({ files: [] });
  }
});

app.post('/api/submit', (req, res) => {
  const { group, name, correct, incorrect, skipped, percentage, total, timestamp } = req.body;
  const groupKey = group && group.trim() ? group.trim() : 'Ungrouped';
  if (!name) {
    return res.status(400).json({ success: false, message: 'name required' });
  }

  const data = readResults();
  data.groups = data.groups || {};
  if (!data.groups[groupKey]) {
    data.groups[groupKey] = [];
  }

  data.groups[groupKey].push({
    name,
    correct,
    incorrect,
    skipped,
    percentage,
    total,
    timestamp
  });

  saveResults(data);
  res.json({ success: true });
});

app.get('/download-test', (req, res) => {
  if (!fs.existsSync(TEST_FILE)) {
    return res.status(404).send('Test fayli topilmadi.');
  }
  res.download(TEST_FILE, 'axborot_test.doc');
});

// Upload a new test file (any type) into the tests folder
app.post('/upload-test', upload.single('testfile'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'no file' });
  // multer already saved the file to tests/ with a temp name; keep original name
  try {
    const orig = req.file.originalname || req.file.filename;
    const destPath = path.join(__dirname, 'tests', orig);
    fs.renameSync(req.file.path, destPath);
    res.json({ success: true, file: `/tests/${encodeURIComponent(orig)}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
