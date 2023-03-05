const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
//   for (let i = 0; i < numCPUs; i++) {
//     cluster?.fork();
//   }
//
//   cluster?.on("online", function (worker) {
//     console.log("Worker " + worker.process.pid + " is listening");
//   });
//   cluster?.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//     console.log("Let's fork another worker!");
//     cluster?.fork();
//   });
// }
for (let i = 0; i < 100000; i++) {
  console.log(i);
}
