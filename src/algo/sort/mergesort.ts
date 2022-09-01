import { Algo } from "../../algo";
import { BarListInfo, BarList, emptyBarInfo, Bars, swap } from "../../data/bars";
import { Informing } from "../../draw";
import { MergeSortEnv } from "../../env/sort_env";

export type MergeParameter = [number];

type MergeState = "splitting" | "collecting"

class MergeSort extends Algo<MergeParameter, void, BarList> implements Informing<BarListInfo> {
    name = "Merge Sort";
    env: MergeSortEnv;

    state: MergeState = "splitting"

    index = 0;
    fromA = 0;
    fromB = 0;

    async body(index: number) {
        this.index = index;
        let lower = this.env.data[index];
        await this.env.breakpoint();
        if(lower.length < 2){
            return;
        }

        if(lower.length == 2){
            if(lower[0].value > lower[1].value) {
                swap(lower, 0, 1);
                return;
            }
        }
        const middle = Math.floor(lower.length / 2);
        let upper = lower.splice(middle) as Bars;
        this.env.data.splice(index+1, 0, upper);
        
        await this.env.run(mergesort(index));
        await this.env.run(mergesort(index+1));

        let collector = new Bars(0);
        lower = this.env.data[index];
        upper = this.env.data[index + 1];
        this.state = "collecting";

        this.env.data.splice(index, 0, collector);

        while(lower.length && upper.length) {
            if(lower[0].value <= upper[0].value){
                collector.push( lower.splice(0,1)[0]! );
            }
            else{
                collector.push( upper.splice(0,1)[0]! );
            }

            await this.env.breakpoint();
        }
        
        while(lower.length > 0) {
            collector.push( lower.splice(0,1)[0]! );
            await this.env.breakpoint();
        }

        while(upper.length > 0) {
            collector.push( upper.splice(0,1)[0]! );
            await this.env.breakpoint();
        }

        this.env.data.splice(index+1, 2);
    }

    create_info(){
        if(this.state == "splitting"){
            let arr = [];
            arr[this.index] = emptyBarInfo(this.env.data[this.index]);
            return arr;
        }
        else {
            let arr = [];
            arr[this.index] = emptyBarInfo(this.env.data[this.index]);
            arr[this.index+1] = emptyBarInfo(this.env.data[this.index+1]);
            arr[this.index+2] = emptyBarInfo(this.env.data[this.index+2]);
            return arr;
        }
    }

    constructor(env: MergeSortEnv, ...arr:MergeParameter){
        super(env, ...arr);
        this.env = env;
    }
}



export const mergesort = (index: number) => (env: MergeSortEnv) => (new MergeSort(env, index));