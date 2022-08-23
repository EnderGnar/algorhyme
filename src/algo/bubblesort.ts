import { Algo } from "../algo";
import { BarInfo, Bars } from "../data/bars";
import { Informing } from "../draw";
import { SortEnv } from "../env/sort_env";

class BubbleSort extends Algo<[], void, Bars> implements Informing<BarInfo> {
    name = "BubbleSort";

    i: number
    j: number

    async body(){
        const arr = this.env.data;
        const len = arr.length;

        for(this.i = 0; this.i < len; this.i++){
            for(this.j = len - 1; this.j > this.i; this.j--) {
                await this.env.breakpoint();
                if(arr[this.j].value < arr[this.j-1].value){
                    await this.swap(arr, this.j-1, this.j);
                }
            }
        }
    }

    async swap(arr: Bars, i: number, j: number){
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        await this.env.breakpoint()
    }

    create_info(): BarInfo{
        const j_c = (this.env.data[this.j].value < this.env.data[this.j-1].value) ? "gray" : "green"
        return {
            range: [0, this.env.data.length],
            highlight: [
                {index: this.i, color: "red"},
                {index: this.j-1, color: j_c},
                {index: this.j, color: j_c},
            ]
        };
    };

    constructor(env: SortEnv){
        super(env)

        this.i = 0;
        this.j = this.env.data.length-1;
    }
}

export const bubblesort = () => (env: SortEnv) => new BubbleSort(env);
