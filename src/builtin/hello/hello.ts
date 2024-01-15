import { Algorithm } from "../../algorithm";
import { Command } from "../../command";
import { Machine } from "../../machine";

// The arguments for the algorithm. We declare them in such a way because they must be initialized by the Command.
type HelloArgs = [string]

// The algorithm is an async function.
const helloWorldAlgo: Algorithm<HelloArgs, void> = async (_locals, machine, name) => {
    // A breakpoint
    await machine.break();
    machine.log(`Hello,`);
    await machine.break();
    machine.log(` ${name}`);
}

// We register a function to initialize the locals that should be tracked in the stack frame.
Machine.register_initializer(helloWorldAlgo, () => {})

// A basic command to log `Hello, ${name}`.
export const helloWorldCommand = (name: string): Command<HelloArgs> => {
    return {
        init: (_machine: Machine) => {
            return [helloWorldAlgo, [name]]
        },
        cleanup: () => {},
    };
};
