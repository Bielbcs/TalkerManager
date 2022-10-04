const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { readTalkerFile } = require('./utils/fsUtils');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkers = await readTalkerFile();
  res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalkerFile();
  const filteredTalker = talkers.find((talker) => talker.id === Number(id));

  return filteredTalker ? res.status(HTTP_OK_STATUS).json(filteredTalker) 
    : res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', async (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  return res.status(HTTP_OK_STATUS).json({ token });
});
