const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:9rrzQfu0AqTd0xEnDwqf@containers-us-west-92.railway.app:5801', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Terhubung ke MongoDB'))
  .catch(err => console.error('Gagal terhubung ke MongoDB:', err));

module.exports = mongoose;
