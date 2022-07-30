import { Algo, Runnable } from "./algo";


export abstract class Env<D>{
    abstract data: D;
    stack: Runnable[] = []

    async run<T extends Array<any>, G>(algo: (env: this) => Algo<T,G>): Promise<G>{
        const algorithm = algo(this)
        this.stack.push(algorithm)
        const res = await algorithm.run();
        this.stack.pop()
        return res
    }

    wait_stack: (() => void)[] = [];

    breakpoint(){ 
        return new Promise<void>(resolve => {
            this.wait_stack.push(resolve);
        })
    };

    step(){
        if(this.wait_stack.length == 0) return false;

        let res = this.wait_stack.pop()!;
        return res();
    }
}

