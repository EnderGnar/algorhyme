import { Algorithm, Args } from "./algorithm";
import { Machine } from "./machine";

export type Command<A extends Args> = {
    // Returns the algorithm it wants to execute and
    init: (machine: Machine) => [Algorithm<A, any>, A],
    cleanup: (machine: Machine) => void,
    result?: number | void,
}

export function defaultCommandBuilder<A extends Args>(algo: Algorithm<A, any>): ((...a: A) => Command<A>) {
    return (...a: A) => ({
        init: (machine: Machine) => {
            return [algo, a]
        },
        cleanup: ()=>{}
    });
}
