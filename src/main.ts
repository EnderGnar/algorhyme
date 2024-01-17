import { hanoiCommand } from "./builtin/hanoi/hanoi";
import { towers } from "./builtin/hanoi/towers";
import { Machine } from "./machine";

let m = new Machine();
let towers_id = m.allocate(towers(5));

let towers_ref = m.heap.get(towers_id);

m.command_queue.push(hanoiCommand(towers_id, "A", "C"));

setInterval(() => {
    m.step();
    console.log(towers_ref)
}, 100);
