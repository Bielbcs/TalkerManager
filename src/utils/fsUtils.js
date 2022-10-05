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
  } catch (error) {
    console.error(error.message);
  }
};

const updateTalkerFile = async (id, newTalker) => {
  try {
    const oldTalkers = await readTalkerFile();

    const index = oldTalkers.findIndex((talker) => talker.id === Number(id));
    const toEdit = oldTalkers.find((talker) => talker.id === Number(id));

    const editedTalker = { ...toEdit, ...newTalker };

    oldTalkers.splice(index, 1, editedTalker);

    await fs.writeFile('src/talker.json', JSON.stringify(oldTalkers));
    
    return oldTalkers;
  } catch (error) {
    console.error(error.message);
  }
};

const deleteTalkerFile = async (id) => {
  try {
    const oldTalkers = await readTalkerFile();

    const index = oldTalkers.findIndex((talker) => talker.id === Number(id));

    oldTalkers.splice(index, 1);

    await fs.writeFile('src/talker.json', JSON.stringify(oldTalkers));
  } catch (error) {
    console.error(error.message);
  }
};

const searchTalkerFile = async (term) => {
  const oldTalkers = await readTalkerFile();

  const filteredArray = oldTalkers
    .filter(({ name }) => name.toLowerCase().includes(term.toLowerCase()));

  return filteredArray;
};

module.exports = {
  readTalkerFile,
  writeTalkerFile,
  updateTalkerFile,
  deleteTalkerFile,
  searchTalkerFile,
};