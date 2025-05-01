const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const compileRoutes = require('./routes/compile');
const historyRoutes = require('./routes/history');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/codebuds', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/compile', compileRoutes);
app.use('/api/history', historyRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
