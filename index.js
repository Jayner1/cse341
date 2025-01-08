const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Jason Yale');
});

app.get('/contacts', (req, res) => {
  fs.readFile('contacts.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading contacts data');
    }

    const contacts = JSON.parse(data);
    res.json(contacts);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
