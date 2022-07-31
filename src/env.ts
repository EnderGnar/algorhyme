import { Runnable } from "./algo";


type PromiseExecutor = [() => void, (reason?: any) => void]

export interface Data {
    reset: () => void
}

export abstract class Env<D extends Data>{
    abstract data: D;
    stack: Runnable<any, D>[] = []
    queue: Runnable<any, D>[] = [];

    async run<G>(algo: (env: this) => Runnable<G, D>): Promise<G>{
        const algorithm = algo(this)
        this.stack.push(algorithm)

        try {
            const res = await algorithm.run();
            return res
        } catch(e) {
            throw e
        }
        finally {
            this.stack.pop()
        }
    }

    /**
     * Do not use this. Internal service
     */
    run_from_queue(){
        const next = this.queue.splice(0,1)[0];
        next.run().catch(e => {
            console.error(e);
        })
    }

    enqueue<G>(algo: (env: this) => Runnable<G, D>): void {
        this.queue.push(algo(this));
    }

    wait_executor?: PromiseExecutor;
    interval = -1;

    speed = 0;
    speed_list = [[500,1], [200,1], [100, 1], [33, 1], [10, 1], [10, 2], [10, 4], [10, 8], [10, 32], [10, 256]]
    skip_count = 0;

    breakpoint(){ 
        return new Promise<void>((resolve, reject) => {
            if(this.skip_count > 0){
                this.skip_count -= 1
                resolve();
            }
            else {
                if(this.wait_executor !== undefined) throw "Dev error! already waiting somewhere else on a breakpoint"
                this.wait_executor = [resolve, reject]
            }
        })
    };

    step(){
        if(this.wait_executor == undefined) {
            //if current algo has finished and another is in queue, start executing that algo.
            if(this.stack.length == 0 && this.queue.length > 0) {
                this.run_from_queue()
            }
            return false
        };

        let res = this.wait_executor[0];
        this.wait_executor = undefined;
        res();
        return true
    }

    start(){
        if(this.interval < 0) {
            const rate = this.speed_list[this.speed][0]
            this.interval = setInterval(() => this.loop(), rate);
        }
    }

    stop(){
        if(this.interval < 0) return

        clearInterval(this.interval);
        this.interval = -1
    }

    speed_up(){
        if(this.speed + 1 < this.speed_list.length) {
            this.speed += 1;
            this.reinterval(this.speed-1);
            return true
        }

        return false;
    }

    speed_down(){
        if(this.speed > 0) {
            this.speed -= 1;
            this.reinterval(this.speed+1);
            return true
        }
        
        return false;
    }

    reinterval(previous: number){
        if(this.interval < 0) return;

        const p_rate = this.speed_list[previous][0];
        const c_rate = this.speed_list[this.speed][0];

        if(p_rate !== c_rate) {
            clearInterval(this.interval);
            this.interval = setInterval(() => this.loop(), c_rate);
        }
    }

    loop(){
        let amount = this.speed_list[this.speed][1];
        if(this.step()) amount -= 1;
        this.skip_count = amount;
    }

    //cancels current algorithm without reseting the data
    cancel(){
        if(this.wait_executor) {
            this.wait_executor[1]()
            this.wait_executor = undefined
        }
    }

    reset(){
        this.cancel()
        this.data.reset()
    }
}