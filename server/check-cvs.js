const CV = require('./src/models/CV');
const sequelize = require('./src/config/sequelize');

async function test() {
  try {
    const cvs = await CV.findAll();
    cvs.forEach(cv => {
      console.log(`ID: ${cv.id} | Type: ${cv.type} | FilePath: ${cv.file_path}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

test();
