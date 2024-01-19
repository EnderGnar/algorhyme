import { Algorithm, register_default_locals, register_void_locals } from "../../algorithm";
import { heapCommandBuilder } from "../../command";
import { Bars } from "./bars";

// The arguments for the algorithm. We declare them in such a way because they must be initialized by the Command.
type ShuffleArgs = [Bars]

// The algorithm is an async function.
export const shuffle: Algorithm<ShuffleArgs, void> = async (_locals, machine, bars) => {
    const len = bars.length;

    for(let i = 0; i < len*len; i++){
        let a = Math.floor(machine.random()*len);
        let b = Math.floor(machine.random()*len);
        [bars[a], bars[b]] = [bars[b], bars[a]];
    }
}
register_void_locals(shuffle);


export const shuffleCommand = heapCommandBuilder(shuffle);
