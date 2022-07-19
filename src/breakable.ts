import { Env } from "./env";

export abstract class BreakableEnv<D> extends Env<D> {
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