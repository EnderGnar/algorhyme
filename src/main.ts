import { bars } from "./builtin/sort/bars";
import { bubbleCommand } from "./builtin/sort/bubblesort";
import { shuffleCommand } from "./builtin/sort/shuffle";
import { Machine } from "./machine";

let m = new Machine();
let bars_id = m.allocate(bars(5));

let bars_ref = m.heap.get(bars_id);

m.command_queue.push(shuffleCommand(bars_id));
m.command_queue.push(bubbleCommand(bars_id));

setInterval(() => {
    m.step();
    console.log(bars_ref)
}, 1000);
