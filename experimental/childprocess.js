const { exec, execFile, spawn } = require("child_process");

//execute small commands
exec("diskpart", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.log(stderr);
  }
  console.log(stdout);
});

//execute files:
execFile("./exec.sh", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.log(stderr);
  }
  console.log(stdout);
});

const child = spawn("ls", ["-lh"]);
d;
child.stdout.on("data", (ata) => {
  console.log(`stdout: ${data}`);
});
child.stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);
});
child.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
child.on("error", (error) => {
  console.log(`exec error: ${error}`);
});
