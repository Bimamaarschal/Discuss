const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Hubungkan ke MongoDB
mongoose.connect('mongodb://mongo:9rrzQfu0AqTd0xEnDwqf@containers-us-west-92.railway.app:5801', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Membuat skema dan model untuk posting diskusi
const discussionSchema = new mongoose.Schema({
  title: String,
  content: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }]
});

const Discussion = mongoose.model('Discussion', discussionSchema);

// Membuat skema dan model untuk komentar
const commentSchema = new mongoose.Schema({
  text: String,
  discussion: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }
});

const Comment = mongoose.model('Comment', commentSchema);

// Membuat skema dan model untuk like
const likeSchema = new mongoose.Schema({
  discussion: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }
});

const Like = mongoose.model('Like', likeSchema);

// Menampilkan halaman utama dengan daftar posting diskusi
app.get('/', async (req, res) => {
  try {
    const discussions = await Discussion.find({})
      .populate('comments')
      .populate('likes');
    res.render('index', { discussions: discussions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan dalam mengambil data');
  }
});

// Menampilkan halaman tambah posting diskusi
app.get('/add', (req, res) => {
  res.render('add');
});

// Menyimpan posting diskusi baru ke database
app.post('/add', async (req, res) => {
  const discussion = new Discussion({
    title: req.body.title,
    content: req.body.content
  });

  try {
    await discussion.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan dalam menyimpan data');
  }
});

// Rute untuk menambahkan komentar ke diskusi
app.post('/discussion/:id/comment', async (req, res) => {
  const discussionId = req.params.id;
  const text = req.body.text;

  const comment = new Comment({
    text: text,
    discussion: discussionId
  });

  try {
    await comment.save();
    // Tambahkan komentar ke diskusi
    const discussion = await Discussion.findById(discussionId);
    discussion.comments.push(comment);
    await discussion.save();

    res.redirect(`/discussion/${discussionId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan dalam menyimpan komentar');
  }
});

// Rute untuk menambahkan like ke diskusi
app.post('/discussion/:id/like', async (req, res) => {
  const discussionId = req.params.id;

  const like = new Like({
    discussion: discussionId
  });

  try {
    await like.save();
    // Tambahkan like ke diskusi
    const discussion = await Discussion.findById(discussionId);
    discussion.likes.push(like);
    await discussion.save();

    res.redirect(`/discussion/${discussionId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan dalam menyimpan like');
  }
});

// Menjalankan server pada port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
