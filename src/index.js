const core = require("@actions/core");
const github = require("@actions/github");
const toolCache = require("@actions/tool-cache");
const { exec } = require("child_process");

console.log("Now?");

async function main() {
  try {
    const download = getDownloadObject();
    core.info(`Downloading suave-geth from: ${download.url}`);
    const pathToArchive = await toolCache.downloadTool(download.url);

    // Extract the archive onto host runner
    core.debug(`Extracting ${pathToArchive}`);
    const extract = download.url.endsWith(".zip") ? toolCache.extractZip : toolCache.extractTar;
    const pathToCLI = await extract(pathToArchive);

    // Expose the tool
    core.addPath(path.join(pathToCLI, download.binPath));
  } catch (error) {
    core.setFailed(error.message);
  }

  try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput("who-to-greet");
    console.log(`Hello ${nameToGreet}!`);
    const time = new Date().toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

function getDownloadObject() {
  const url = `https://github.com/ferranbt/suave-geth/releases/download/v0.3.3/suave-geth_v0.3.3_linux_amd64.zip`;

  return {
    url,
    binPath: ".",
  };
}

module.exports = main;

if (require.main === module) {
  main();
}
