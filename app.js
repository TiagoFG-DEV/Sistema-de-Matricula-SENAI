const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const fs = require('fs');
const DATA_FILE = path.join(__dirname, 'db.json');
const multer = require('multer');

//Upload de foto de perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage });

//app.js
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/list.html'));
});

app.get('/api/alunos', (req, res) => {
    const dados = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json(dados);
});

app.post('/add', upload.single('foto'), (req, res) => {
    const { Nome, Email, Telefone, date } = req.body;

    const dados = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    const novoItem = {
        id: Date.now(),
        Nome,
        Email,
        Telefone,
        date,
        foto: `/uploads/${req.file.filename}`
    };

    dados.push(novoItem);

    fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2));

    res.redirect('/');

    console.log(req.body);
    console.log(req.file);
});

app.listen(PORT, () => {
    console.log(`Server rodando em http://localhost:${PORT}`);
});

