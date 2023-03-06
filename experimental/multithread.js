const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

/*
multi thread in JS:
Multi thread in js, based on workers.
a worker is another core that can run in parallel to the master thread.

multi thread works with IPC -Interprocess communication:

IPC is the mechanisms and techniques used by operating systems to allow multiple processes
 to communicate and share data with each other.
To use multi-thread communication, IPC uses a few mechanisms:
1. Pipes: a one way communication channel between processes, which one writes the data and another one reads it.
2. Sockets: a tow way communication channel between processes over a network,
 Sockets allow processes running on different computers to communicate with each other.
3. Shared Memory: a mechanism for tow or more processes to share a region of memory that can be read and written by all processes.
4. Message Queues:allows processes to send and receive messages, each message is addressed and has a priority.
5. Signal: a mechanism for Asynchronous notifications between processes.
 Signal is a software interrupt that is sent to a process to notify it of an event


 Problems:
 1. Race conditions: when two processes are trying to modify the same shared memory region at the same time.
 2. Deadlock: when two or more processes are waiting for each other to release a lock resource that they need to continue running.
  this occurs when threads acquire resources in a specific order and release them in a different order.
 3. OverHead: basically overload of the system.
 4. Memory Usage: consuming too much memory from the system.
 5. Synchronization issues: wrong synchronization between processes.
 6. I/O-bound tasks: node is designed for I/O-bound tasks,
  multi thread processes will not improve the I/O operations as they are limited by the speed of the I/O subsystem.
  ( disk reads and network requests).

Lock: is a synchronization mechanism that is used to ensure that only one thread can access a shared memory region at a time.
Semaphore: is a synchronization mechanism that allows and limit multiple threads to access a shared memory region at the same time.

to get into the cluster settings: just log out the cluster.settings
to get the master process id: just log out the process.pid

 */

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster?.fork();
  }

  cluster?.on("online", function (worker) {
    console.log(
      "Worker " + worker.process.pid + " is listening",
      cluster.settings
    );
  });
  cluster?.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster?.fork();
  });
} else {
}
