const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { readTalkerFile, writeTalkerFile, 
  updateTalkerFile, deleteTalkerFile } = require('./utils/fsUtils');

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
    : res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
});

const emailValidation = (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ message: 'O campo "email" é obrigatório' });

  const re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    return res.status(400).send({ 
      message: 'O "email" deve ter o formato "email@email.com"' }); 
  }
  next();
};

const passwordValidation = (req, res, next) => {
  const { password } = req.body;
  if (!password) res.status(400).send({ message: 'O campo "password" é obrigatório' });
  if (password.length < 6) { 
    return res.status(400).send({ message: 'O "password" deve ter pelo menos 6 caracteres' }); 
  }
  next();
};

app.post('/login', emailValidation, passwordValidation, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  return res.status(HTTP_OK_STATUS).json({ token });
});

const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send({ message: 'Token não encontrado' });
  if (authorization.length < 16) return res.status(401).send({ message: 'Token inválido' });
  next();
};

const nameValidation = (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(400).send({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(400).send({ message: 'O "name" deve ter pelo menos 3 caracteres' }); 
  }
  next();
};

const ageValidation = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(400).send({ message: 'O campo "age" é obrigatório' });
  if (age < 18) {
    return res.status(400).send({ message: 'A pessoa palestrante deve ser maior de idade' }); 
  }
  next();
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) return res.status(400).send({ message: 'O campo "talk" é obrigatório' });

  const { watchedAt } = talk;
  if (!watchedAt) return res.status(400).send({ message: 'O campo "watchedAt" é obrigatório' });

  const dataRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  const dateMessage = 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';

  if (!dataRegex.test(watchedAt)) return res.status(400).send({ message: dateMessage });

  next();
};

const rateValidation = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (rate === undefined) return res.status(400).send({ message: 'O campo "rate" é obrigatório' });
  if (rate < 1 || rate > 5) {
    console.log('entrou');
    return res.status(400).send({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};  

app.post('/talker', tokenValidation, nameValidation, 
ageValidation, talkValidation, rateValidation, async (req, res) => {
  await writeTalkerFile(req.body);

  const updatedTalkers = await readTalkerFile();
  
  res.status(201).json(updatedTalkers[updatedTalkers.length - 1]);
});

app.put('/talker/:id', tokenValidation, nameValidation, 
ageValidation, talkValidation, rateValidation, async (req, res) => {
  const { id } = req.params;

  const editedTalkers = await updateTalkerFile(id, req.body);

  res.status(200).json(editedTalkers[editedTalkers.length - 1]);
});

app.delete('/talker/:id', tokenValidation, async (req, res) => {
  const { id } = req.params;
  await deleteTalkerFile(id);
  res.status(204).end();
});
