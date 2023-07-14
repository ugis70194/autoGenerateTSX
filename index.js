const { Toolkit } = require('actions-toolkit');
const fs = require('fs');

const workingDir = process.env.GITHUB_WORKSPACE+"/contents";

function toTypeScriptFromat(work, detail){
  let body = "";
  for(const key of Object.keys(detail)){
    body += `${key}:"${detail[key]}",`;
  }
  body = body.slice(0,-1); // 末尾の , を削除
  return `const ${work}: Work = {${body}}`
}

Toolkit.run(async tools => {
  console.log(workingDir);
  try {
    const works = fs.readdirSync(workingDir);
    console.log(works);
    for(const work of works){
      const targetDir = workingDir + work; 
      console.log(targetDir);
      const detail = JSON.parse(fs.readFileSync(targetDir, "utf-8"));
      console.log(detail);
      console.log(toTypeScriptFromat(work, detail))
    }
  } catch (e) {
    tools.log.fatal(e);
    tools.exit.failure('Failed');
  }
})
