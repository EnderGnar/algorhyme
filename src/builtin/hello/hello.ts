import { Algorithm, LocalInit } from "../../algorithm";
import { Command, defaultCommandBuilder } from "../../command";
import { Machine } from "../../machine";

// The arguments for the algorithm. We declare them in such a way because they must be initialized by the Command.
type HelloArgs = [string]

// The algorithm is an async function.
export const helloWorldAlgo: Algorithm<HelloArgs, void> = async (_locals, machine, name) => {
    // A breakpoint
    await machine.break();
    machine.log(`Hello,`);
    await machine.break();
    machine.log(` ${name}`);
}

// We register a function to initialize the locals that should be tracked in the stack frame.
let helloLocalInit: LocalInit<void> = () => {};
Machine.register_initializer(helloWorldAlgo, helloLocalInit);

// A basic command to log `Hello, ${name}`.
export const helloWorldCommand = defaultCommandBuilder(helloWorldAlgo);
