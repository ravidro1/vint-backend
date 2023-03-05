const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

function check() {
  if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);
    cluster.fork(check);
  } else if (cluster.isWorker) {
    console.log(`Worker process ${process.pid} is running`);
  }
}
function none() {
  console.log("nnone");
}
none();
cluster.fork();
check();
