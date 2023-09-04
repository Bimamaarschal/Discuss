// posts.js
const express = require('express');
const router = express.Router();
const DiscussionPost = require('./models'); // Mengimpor model mongoose

router.get('/posts', async (req, res) => {
  try {
    const posts = await DiscussionPost.find();
    res.render('index', { posts });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data postingan diskusi' });
  }
});

router.post('/posts', async (req, res) => {
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

router.post('/posts/:postId/like', async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await DiscussionPost.findById(postId);
      post.likes++;
      await post.save();
      res.redirect("/posts/" + postId); // Redirect ke halaman daftar postingan setelah menyukai postingan
    } catch (err) {
      res.status(500).json({ error: 'Gagal menyukai postingan' });
    }
  });
  

router.post('/posts/:postId/comment', async (req, res) => {
    try {
      const postId = req.params.postId;
      const { text } = req.body;
      const post = await DiscussionPost.findById(postId);
      post.comments.push({ text });
      await post.save();
      res.redirect("/posts/" + postId);// Redirect ke halaman daftar postingan setelah menambahkan komentar
    } catch (err) {
      res.status(500).json({ error: 'Gagal menambahkan komentar ke postingan' });
    }
  });

// Menampilkan halaman detail postingan

router.get('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await DiscussionPost.findById(postId);
    res.render('posts-detail', { post });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data postingan' });
  }
});

// Menghapus postingan berdasarkan ID
router.delete('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    await DiscussionPost.findByIdAndRemove(postId); // Menghapus postingan dari database berdasarkan ID
    res.redirect('/posts'); // Redirect ke halaman daftar postingan setelah berhasil menghapus
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus postingan' });
  }
});
  
module.exports = router;
