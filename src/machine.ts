import { Algorithm, Args, LocalInit } from "./algorithm";
import { Command } from "./command";
import { HeapObject } from "./heap-object";

type StackFrame<A extends Args, T> = {
    algo: Algorithm<A, T>,
    locals: T,
    args: A,
}

type Resolve = (value: void | PromiseLike<void>) => void;
type Reject  = (reason?: any) => void;

// The machine is the basic unit of running an algorithm.
export class Machine {
    command_queue: Command<any>[];
    active_command?: Command<any>;

    stack: StackFrame<any, any>[];

    // Shares objects between multiple commands.
    heap: Map<number, HeapObject>;
    count = 0;

    // The waiting positions.
    wait_executor?: {resolve: Resolve, reject: Reject} = undefined;
    skip_count = 0;

    // Initializers
    static initializers = new Map();

    constructor() {
        this.command_queue = [];
        this.stack = [];
        this.heap = new Map();
    }

    static register_initializer<A extends Args, T>(func: Algorithm<A, T>, initializer: LocalInit<T>) {
        this.initializers.set(func, initializer)
    }

    static get_locals<A extends Args, T>(func: Algorithm<A, T>): T {
        let initer = this.initializers.get(func);
        if(initer == undefined) throw "No initializer registered."
        return initer();
    }

    async call<A extends Args, T>(algo: Algorithm<A, T>, ...args: A) {
        let locals = Machine.get_locals(algo);
        this.stack.push({
            algo,
            locals,
            args
        })

        let res = await algo(locals, this, ...args);
        this.stack.pop();
        return res
    }

    dispatch() {
        if(this.command_queue.length == 0) throw "Nothing to dispatch.";
        if(this.active_command) throw "Already running a command."

        this.active_command = this.command_queue.splice(0, 1)[0];

        let [algo, args] = this.active_command.init(this);
        this.call(algo, ...args)
        .then(res => this.active_command!.result = res)
        .finally(
            () => {
                let wait_executor = this.wait_executor;
                this.wait_executor = undefined
                wait_executor?.reject()

                this.active_command!.cleanup(this)
                this.active_command = undefined;
            }
        );
    }

    step(num: number = 1) {
        // Nothing to do.
        if(num < 1) return;

        if(this.stack.length == 0 && this.command_queue.length > 0) this.dispatch();

        if(this.wait_executor) {
            this.skip_count = num - 1;
            let wait_executor = this.wait_executor;
            this.wait_executor = undefined;
            wait_executor.resolve();
        } else {
            this.skip_count = num;
        }
    }

    break(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if(this.skip_count > 0){
                this.skip_count -= 1
                resolve();
            }
            else {
                if(this.wait_executor !== undefined) throw "Dev error! already waiting somewhere else on a breakpoint"
                this.wait_executor = {resolve, reject}
            }
        })
    }

    // Exposed functions
    allocate(obj: HeapObject) {
        let id = this.count++;
        this.heap.set(id, obj);
        return id;
    }

    log(...args: any[]) {
        console.log(...args);
    }

    random() {
        return Math.random();
    }
}
