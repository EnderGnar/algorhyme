import { helloWorldCommand } from "./builtin/hello/hello";
import { Machine } from "./machine";

let m = new Machine();

m.command_queue.push(helloWorldCommand("Yannik"));

setInterval(() => m.step(), 1000);
