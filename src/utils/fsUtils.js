const fs = require('fs').promises;

const readTalkerFile = async () => {
  try {
    const data = await fs.readFile('src/talker.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  readTalkerFile,
};