import { callCommand } from "./builtin/call/call";
import { Machine } from "./machine";

let m = new Machine();

m.command_queue.push(callCommand("Yannik"));
m.command_queue.push(callCommand("Yannik"));

setInterval(() => {
    m.step();
}, 1000);
