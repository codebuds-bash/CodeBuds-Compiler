const express = require('express');
const CodeHistory = require('../models/codeHistory');
const router = express.Router();

router.post('/history', async (req, res) => {
  const { code, language, output, userId } = req.body;
  const history = new CodeHistory({ userId, code, language, output });
  await history.save();
  res.json({ message: 'Code history saved' });
});

router.get('/history', async (req, res) => {
  const { userId } = req.query;
  const history = await CodeHistory.find({ userId });
  res.json({ history });
});

module.exports = router;
