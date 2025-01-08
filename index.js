const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Jason Yale');
});

app.get('/contacts', (req, res) => {
    res.json({
      contacts: [
        { name: 'Jason Yale', email: 'jasontyale@gmail.com' }
      ]
    });
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
