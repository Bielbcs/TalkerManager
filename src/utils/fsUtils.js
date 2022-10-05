const fs = require('fs').promises;

const readTalkerFile = async () => {
  try {
    const data = await fs.readFile('src/talker.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error.message);
  }
};

const writeTalkerFile = async (newTalker) => {
  try {
    const oldTalkers = await readTalkerFile();

    const newId = oldTalkers[oldTalkers.length - 1].id + 1;

    const newObject = { id: newId, ...newTalker };

    const newArray = JSON.stringify([...oldTalkers, newObject]);

    await fs.writeFile('src/talker.json', newArray);
    console.log('Arquivo escrito com sucesso!');
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  readTalkerFile,
  writeTalkerFile,
};