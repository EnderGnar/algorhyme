import { Algo } from "../../algorithm";
import { BarInfo, Bars, swap } from "../../data/bars";
import { Informing } from "../../draw";
import { SortEnv } from "../../env/sort_env";

export type QuickParameter = [number, number];

class QuickSort extends Algo<QuickParameter, void, Bars> implements Informing<BarInfo> {
    env: SortEnv;
    name = "Quick Sort";

    pivot = 0;
    lower = 0;
    upper = 0;

    async body(from: number, to: number) {
        const arr = this.env.data;

        this.lower = from;
        this.upper = to-1;
        this.pivot = from + Math.floor(this.env.random()*(to - from));
        await this.env.breakpoint();

        //base case
        if(from + 1 == to){
            return;
        }
        
        swap(arr, this.pivot, this.upper);
        this.pivot = this.upper;
        this.upper -= 1;
        await this.env.breakpoint();

        let p_val = arr[this.pivot].value;

        while(this.lower < this.upper){
            while(this.lower < this.upper && arr[this.lower].value <= p_val){
                this.lower += 1;
                await this.env.breakpoint()
            }

            while(this.lower < this.upper && arr[this.upper].value > p_val){
                this.upper -= 1;
                await this.env.breakpoint()
            }

            if(this.lower < this.upper) {
                swap(arr, this.lower, this.upper);
                await this.env.breakpoint()
            }
        }

        //left of lower all lower than pivot. right of upper all greater than pivot.
        //arr[upper] is only <= pivot if upper never moved.

        if(this.upper < this.pivot - 1){
            swap(arr, this.upper, this.pivot);
            this.pivot = this.upper;
            await this.env.breakpoint()

            if(this.pivot > from) await this.env.run(quick_rec(from, this.pivot))
            await this.env.run(quick_rec(this.pivot + 1, to))
        }
        else {
            if(arr[this.upper].value > p_val){
                swap(arr, this.upper, this.pivot);
                this.pivot = this.upper;
                await this.env.breakpoint()
            }
            if(this.pivot > from) await this.env.run(quick_rec(from, this.pivot))
        }
    }

    create_info(): BarInfo{
        const arr = this.env.data;
        const p_val = arr[this.pivot].value

        return {
            range: [...this.arguments],
            highlight: [
                {index: this.lower, color: (arr[this.lower].value <= p_val)? "green":"gray"},
                {index: this.upper, color: (arr[this.upper].value > p_val)? "green":"gray"},
                {index: this.pivot, color: "red"},
            ]
        }
    }

    constructor(env: SortEnv, ...args: QuickParameter){
        super(env, ...args);
        this.env = env
    }
}

const quick_rec = (from: number, to: number) => (env: SortEnv) => (new QuickSort(env, from, to));
export const quicksort = () => (env: SortEnv) => (new QuickSort(env, 0, env.data.length));
