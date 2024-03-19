const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('hello from homepage!');
});

app.listen(8080, () => {
  console.log('listening...');
});
