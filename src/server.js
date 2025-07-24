const dotenv = require('dotenv')
const app = require('./app')

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


// const express = require('express');
// const app = express();

// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello world!');
// });

// app.post('/user/register', (req, res) => {
//   console.log('Register hit:', req.body);
//   res.status(201).json({ message: 'User created' });
// });

// const PORT = 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
