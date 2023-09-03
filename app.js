const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Set mesin templat EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Koneksi ke MongoDB (ganti URL sesuai dengan koneksi MongoDB Anda di Railway)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:9rrzQfu0AqTd0xEnDwqf@containers-us-west-92.railway.app:5801', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Terhubung ke MongoDB'))
  .catch(err => console.error('Gagal terhubung ke MongoDB:', err));

const DiscussionPost = mongoose.model('DiscussionPost', {
  title: String,
  content: String,
  likes: Number,
  comments: [{
    text: String,
  }],
});

app.get('/', async (req, res) => {
  try {
    const posts = await DiscussionPost.find();
    res.render('index', { posts });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data postingan diskusi' });
  }
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new DiscussionPost({
      title,
      content,
      likes: 0,
      comments: [],
    });
    await newPost.save();
    res.redirect('/posts'); // Redirect ke halaman daftar postingan setelah membuat postingan
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat postingan diskusi baru' });
  }
});

app.post('/posts/:postId/like', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await DiscussionPost.findById(postId);
    post.likes++;
    await post.save();
    res.redirect('/posts'); // Redirect ke halaman daftar postingan setelah menyukai postingan
  } catch (err) {
    res.status(500).json({ error: 'Gagal menyukai postingan' });
  }
});

app.post('/posts/:postId/comment', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;
    const post = await DiscussionPost.findById(postId);
    post.comments.push({ text });
    await post.save();
    res.redirect('/posts'); // Redirect ke halaman daftar postingan setelah menambahkan komentar
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambahkan komentar ke postingan' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
