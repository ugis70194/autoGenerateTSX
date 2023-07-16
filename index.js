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
}

//生成したファイルのコミットとプッシュ
function commitAndPush(){
  Toolkit.run(async tools => {
    await tools.exec("git config --global user.name github-actions");
    await tools.exec("git config --global user.email github-actions@github.com");
    await tools.exec(`git add ${componentsDir}/* -n`);
    await tools.exec('git commit -m "generated"');
    await tools.exec("git push origin main");
  })
  console.log("commit & push");
}

Toolkit.run(async tools => {
  try {
    console.log(appRoot);
    // 作品のデータを取得
    const works = fs.readdirSync(contentsDir);

    // 自動生成されるコンポーネントを格納するディレクトリがない場合は作成
    if(!fs.existsSync(componentsDir)){
      fs.mkdirSync(componentsDir);
    }

    // 空のコンポーネントを生成
    const genres = existGenre(works);
    for(const genre of genres) generateEmptyComponent(genre);

    // 作品のデータからコンポーネントの中身を生成
    for(const work of works){
      const readTargetDir = `${contentsDir}/${work}`; 
      const detailPath = `${readTargetDir}/${process.env.INPUT_TARGET_JSONC}`;
      const detail = jsonc.parse(fs.readFileSync(detailPath, "utf-8"));
    }

    // 生成したコンポーネントを反映
    commitAndPush();

    tools.exit.success('Incrementing the value successfully.');
  } catch (e) {
    tools.log.fatal(e);
    tools.exit.failure('Failed');
  }
})
