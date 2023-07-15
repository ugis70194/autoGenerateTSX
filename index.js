const { Toolkit } = require('actions-toolkit');
const jsonc = require('jsonc');
const fs = require('fs');

const appRoot = `${process.env.GITHUB_WORKSPACE}`;
const contentsDir = `${appRoot}/${process.env.INPUT_CONTENTS_DIRECTORY}`;
const componentsDir = `${appRoot}/${process.env.INPUT_COMPONENTS_DIRECTORY}`;

//detail.jsonに記載されたデータをTypeScriptのObjectに変換
function toTypeScriptFromat(work, detail){
  let body = "";
  for(const key of Object.keys(detail)){
    body += `${key}:"${detail[key]}",`;
  }
  body = body.slice(0,-1); // 末尾の , を削除
  return `const ${work}: Work = {${body}}`
}

//コンテンツとして存在しているジャンルの配列を返す
function existGenre(works){
  return [...new Set(works.map(work => {
    const readTargetDir = `${contentsDir}/${work}`; 
    const detailPath = `${readTargetDir}/${process.env.INPUT_TARGET_JSONC}`;
    const detail = jsonc.parse(fs.readFileSync(detailPath, "utf-8"));
    return detail.genre;
  }))];
}

//空のコンポーネントの生成
function generateEmptyComponent(genre){
  const componentPath = `${componentsDir}/${genre}.tsx`;
  fs.writeFileSync(componentPath, "");
  console.log(`generated ${componentPath}`);
}

Toolkit.run(async tools => {
  try {
    const works = fs.readdirSync(contentsDir);
    // 空のコンポーネントを生成
    const genres = existGenre(works);
    for(const genre of genres) generateEmptyComponent(genre);

    for(const work of works){
      const readTargetDir = `${contentsDir}/${work}`; 
      const detailPath = `${readTargetDir}/${process.env.INPUT_TARGET_JSONC}`;
      const detail = jsonc.parse(fs.readFileSync(detailPath, "utf-8"));
      console.log(detail.genre);
    }
  } catch (e) {
    tools.log.fatal(e);
    tools.exit.failure('Failed');
  }
})
