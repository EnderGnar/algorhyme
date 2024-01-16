import { Algorithm, LocalInit } from "../../algorithm";
import { Command, defaultCommandBuilder } from "../../command";
import { Machine } from "../../machine";
import { helloWorldAlgo } from "../hello/hello";

// The arguments for the algorithm. We declare them in such a way because they must be initialized by the Command.
type CallArgs = [string]

// The algorithm is an async function.
const callAlgo: Algorithm<CallArgs, void> = async (_locals, machine, name) => {
    // A breakpoint
    await machine.break();

    // A call, routed through the machine since we want it to keep track of the operations.
    machine.log("Before call");
    await machine.call(helloWorldAlgo, name);
    machine.log("After call");
}

// We register a function to initialize the locals that should be tracked in the stack frame.
let callLocalInit: LocalInit<void> = () => {};
Machine.register_initializer(callAlgo, callLocalInit);

// A basic command to log `Hello, ${name}`.
export const callCommand = defaultCommandBuilder(callAlgo);
