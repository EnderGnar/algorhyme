import { Algorithm, register_default_locals, register_void_locals } from "../../algorithm";
import { heapCommandBuilder } from "../../command";
import { Bars, cmp } from "./bars";

// The arguments for the algorithm. We declare them in such a way because they must be initialized by the Command.
type BubbleArgs = [Bars]

type BubbleLocals = {
    i: number,
    j: number
}

// The algorithm is an async function.
export const bubblesort: Algorithm<BubbleArgs, BubbleLocals> = async (locals, machine, bars) => {
    const len = bars.length;

    for(locals.i = 0; locals.i < len; locals.i++){
        for(locals.j = len - 1; locals.j > locals.i; locals.j--) {
            await machine.break();
            if(cmp(bars[locals.j], bars[locals.j-1]) < 0){
                await machine.call(swap, bars, locals.j-1, locals.j);
            }
        }
    }
}
register_default_locals(bubblesort, {i: 0, j: 0});


type SwapArgs = [Bars, number, number]
const swap: Algorithm<SwapArgs, void> =async (_locals, machine, bars, a, b) => {
    [bars[a], bars[b]] = [bars[b], bars[a]];
    await machine.break();
}
register_void_locals(swap);

export const bubbleCommand = heapCommandBuilder(bubblesort);
