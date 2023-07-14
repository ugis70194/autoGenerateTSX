const { Toolkit } = require('actions-toolkit');
const fs = require('fs');

const targetDir = process.env.GITHUB_WORKSPACE+"/contents";

Toolkit.run(async tools => {
  console.log(targetDir);
  try {
    const works = fs.readdirSync(targetDir);
    console.log(works)
  } catch (e) {
    tools.log.fatal(e);
    tools.exit.failure('Failed');
  }
})
