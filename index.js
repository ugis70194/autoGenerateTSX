const { Toolkit } = require('actions-toolkit');
const jsonc = require('jsonc');
const fs = require('fs');

const appRoot = `${process.env.GITHUB_WORKSPACE}`;
const workingDir = `${appRoot}/contents`;
const genres = ["Manga", "Novel", "Illust", "CD", "Goods", "PhotoAlbum","Anthology", "Contribution", "Consideration"];

//detail.jsonに記載された
function toTypeScriptFromat(work, detail){
  let body = "";
  for(const key of Object.keys(detail)){
    body += `${key}:"${detail[key]}",`;
  }
  body = body.slice(0,-1); // 末尾の , を削除
  return `const ${work}: Work = {${body}}`
}

function existGenre(works){

}

Toolkit.run(async tools => {
  console.log(workingDir);
  try {
    const works = fs.readdirSync(workingDir);
    console.log(works);
    for(const work of works){
      const readTargetDir = `${workingDir}/${work}`; 
      const detailPath = `${readTargetDir}/detail.json`;
      console.log(readTargetDir);
      const detail = jsonc.parse(fs.readFileSync(detailPath, "utf-8"));
      console.log(detail);
      console.log(toTypeScriptFromat(work, detail))
    }
  } catch (e) {
    tools.log.fatal(e);
    tools.exit.failure('Failed');
  }
})
