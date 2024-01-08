const core = require("@actions/core");
const github = require("@actions/github");
const { exec } = require("child_process");

console.log("Now?");

exec(
  "curl https://gist.githubusercontent.com/ferranbt/9b2765236b1f4297dd06e9e02d3c3432/raw/76e171abe25c79adf8cf4268f792754c4959e7d1/suaveup.sh | bash",
  (error, stdout, stderr) => {
    if (error) {
      console.log(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  },
);

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
