import { Runnable } from "./algo";


export abstract class Env<D>{
    abstract data: D;
    stack: Runnable<any, D>[] = []
    queue: ((env: Env<D>) => Runnable<any, D>)[] = [];

    async run<G>(algo: (env: Env<D>) => Runnable<G, D>): Promise<G>{
        const algorithm = algo(this)
        this.stack.push(algorithm)
        const res = await algorithm.run();
        this.stack.pop()
        return res
    }

    enqueue<G>(algo: (env: Env<D>) => Runnable<G, D>): void {
        this.queue.push(algo);
    }

    wait_stack: (() => void)[] = [];
    interval = -1;

    speed = 0;
    speed_list = [[500,1], [200,1], [100, 1], [33, 1], [10, 1], [10, 2], [10, 4], [10, 8], [10, 32], [10, 256]]
    skip_count = 0;

    breakpoint(){ 
        return new Promise<void>(resolve => {
            if(this.skip_count > 0){
                this.skip_count -= 1
                resolve();
            }
            this.wait_stack.push(resolve);
        })
    };

    step(){
        if(this.wait_stack.length == 0) {
            //if current algo has finished and another is in queue, start executing that algo.
            if(this.stack.length == 0 && this.queue.length > 0) {
                const next = this.queue.splice(0,1)[0];
                this.run(next)

                return true
            }
            return false
        };

        let res = this.wait_stack.pop()!;
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
        console.log(this.skip_count);
        this.skip_count = amount;
    }
}

