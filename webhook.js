require('dotenv').config();
const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const repo = req.body.repository?.name;
  const branch = req.body.ref?.split('/').pop();

  if (branch !== process.env.BRANCH) {
    return res.status(200).send(`Ignored branch: ${branch}`);
  }

  const logFile = './logs/deploy.log';
  const timestamp = new Date().toISOString();
  const projectPath = process.env.PROJECT_DIR;
  const tomcatPath = process.env.TOMCAT_WEBAPPS;

  const commands = `
    cd ${projectPath} &&
    git pull origin ${branch} &&
    mvn clean package &&
    cp ${projectPath}/target/*.war ${tomcatPath}/
  `;

  exec(commands, (error, stdout, stderr) => {
    let log = `[${timestamp}] Deploy triggered for ${repo} (${branch})\n`;
    if (error) {
      log += `ERROR:\n${stderr}\n`;
    } else {
      log += `SUCCESS:\n${stdout}\n`;
    }
    fs.appendFileSync(logFile, log + '\n---\n');
  });

  res.status(200).send('Deployment triggered');
});

app.listen(port, () => {
  console.log(`Webhook listener running on port ${port}`);
});
