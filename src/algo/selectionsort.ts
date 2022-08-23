import { Algo } from "../algo";
import { BarInfo, Bars } from "../data/bars";
import { Informing } from "../draw";
import { SortEnv } from "../env/sort_env";

class SelectionSort extends Algo<[], void, Bars> implements Informing<BarInfo> {
    name = "Selection Sort";

    next = 0;
    iter = 0;
    min = 0;

    async body() {
        const arr = this.env.data
        const len = arr.length;

        for(this.next = 0; this.next < len; this.next++){
            this.min = this.next;
            for(this.iter = this.next + 1; this.iter < len; this.iter++){
                await this.env.breakpoint();

                if(arr[this.min].value > arr[this.iter].value) {
                    this.min = this.iter;
                    await this.env.breakpoint();
                }
            }

            if(this.min != this.next){
                const temp = arr[this.min];
                arr[this.min] = arr[this.next];
                arr[this.next] = temp;
                await this.env.breakpoint();
            }
        }
    }

    create_info(): BarInfo{
        return {
            range: [0, this.env.data.length],
            highlight: [
                {index: this.next, color: "red"},
                {index: this.iter, color: "yellow"},
                {index: this.min, color: "green"},
            ]
        }
    }
}

export const selectionsort = () => (env: SortEnv) => (new SelectionSort(env));