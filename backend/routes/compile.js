const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const router = express.Router();

router.post('/compile', async (req, res) => {
  const { code, language } = req.body;

  // Execute code based on language
  let command = '';
  if (language === 'javascript') {
    command = `node -e "${code}"`;
  } else if (language === 'python') {
    command = `python -c "${code}"`;
  }

  // Handle safe execution (use Docker or VM for safety)
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ message: stderr });
    }
    res.json({ output: stdout });
  });
});

module.exports = router;
