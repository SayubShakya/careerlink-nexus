const Application = require('./src/models/Application');
const CV = require('./src/models/CV');
const JobSeeker = require('./src/models/JobSeeker');
const sequelize = require('./src/config/sequelize');

async function test() {
  try {
    const apps = await Application.findAll({ 
        include: [{ model: JobSeeker }, { model: CV }]
    });
    apps.forEach(app => {
      const name = app.JobSeeker?.fullname || app.name || 'Unknown';
      console.log(`App ID: ${app.id} | Candidate: ${name} | CV FilePath: ${app.CV?.file_path}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

test();
