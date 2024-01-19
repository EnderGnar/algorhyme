import { Algorithm, register_default_locals, register_void_locals } from "../../algorithm";
import { heapCommandBuilder } from "../../command";
import { Bars, cmp } from "./bars";

// The arguments for the algorithm. We declare them in such a way because they must be initialized by the Command.
type SelectArgs = [Bars]

type SelectLocals = {
    next: number,
    min:  number,
    i:    number,
}

// The algorithm is an async function.
export const selectionsort: Algorithm<SelectArgs, SelectLocals> = async (locals, machine, bars) => {
    const len = bars.length;

    for(locals.next = 0; locals.next < len; locals.next++){
        locals.min = locals.next;
        for(locals.i = locals.next + 1; locals.i < len; locals.i++){
            await machine.break();

            if(cmp(bars[locals.min], bars[locals.i]) > 0) {
                locals.min = locals.i;
                await machine.break();
            }
        }

        if(locals.min != locals.next){
            swap(bars, locals.min, locals.next);
            await machine.break();
        }
    }
}
register_default_locals(selectionsort, {i: 0, min: 0, next: 0});

function swap(bars: Bars, a: number, b: number) {
    [bars[a], bars[b]] = [bars[b], bars[a]];
}

export const selectionSortCommand = heapCommandBuilder(selectionsort);
