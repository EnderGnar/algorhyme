import { Algo } from "../algo";
import { Drawable, DrawContext, DrawWithInfo, Pos } from "../draw";
import { Data } from "../env";
import { MergeSortEnv, SortEnv } from "../env/sort_env";

export type Bar = {
    value: number;
}

export type BarInfo = {
    range: [number, number],
    highlight: {
        index: number,
        color: string
    }[]
}

export const emptyBarInfo = (arr: Bars) => ({
    range:[0, arr.length],
    highlight:[]
} as BarInfo)

export class Bars extends Array<Bar> implements Data, Drawable, DrawWithInfo<BarInfo>{
    count: number;
    reset(){
        for(let i = 0; i < this.count; i++) {
            this[i] = {value: i+1}
        }
    };

    draw(draw: DrawContext){
        this.draw_info(draw, emptyBarInfo(this))
    };

    draw_info(draw: DrawContext, info: BarInfo){
        this.draw_raw(draw, info, {x: 10, y:1}, {x: 90, y: 50}, this.length, this.length);
    };

    draw_raw(draw: DrawContext, info: BarInfo, offset: Pos, scale: Pos, count: number, max_size: number) {
        const width = scale.x / count;
        const height = scale.y / max_size;

        const [min, max] = info.range

        for(let i = 0; i < this.length; i++){
            const value = this[i].value
            const color = `hsla(${value*340 / max_size}, 100%, 69%, ${(min <= i && i < max)?1:0.2})`
            
            draw.rect({x: offset.x + width * (i+1/2), y: offset.y + height*((value+1)/2)}, width*0.8, height*value, {fill: color})
        }

        for(let {index, color} of info.highlight) {
            const value = this[index].value
            draw.rect({x: offset.x + width * (index+1/2), y: offset.y + height*((value+1)/2)}, width*0.8, height*value, {stroke: color, width: 0.5})
        }
    }

    constructor(count: number){
        super()
        this.count = count;
        this.reset();
    }
}

export class BarList extends Array<Bars> implements Data, Drawable, DrawWithInfo<BarListInfo>{
    count: number;
    reset(){
        this.length = 0;
        this[0] = new Bars(this.count)
    };



    constructor(count: number){
        super()
        this.count = count;
        this.reset();
    }
    draw(draw: DrawContext){
        this.draw_info(draw, emptyBarListInfo(this))
    }
    draw_info(draw: DrawContext, info: BarListInfo){
        const max_val = this.reduce((p, c) => p + c.length, 0)
        const count = max_val + (this.length - 1);
        let current = 0;

        for(let i = 0; i < this.length; i++) {
            const bars = this[i];
            bars.draw_raw(draw, (info[i] || {range: [0,0], highlight:[]}), {x: 5 + 90 * current/count, y: 1}, {x: 90, y: 50}, count, max_val);
            current += bars.length + 1;
        }
    };
}

export type BarListInfo = BarInfo[];


export const emptyBarListInfo = (arr: BarList) => (arr.map(e => emptyBarInfo(e)) as BarListInfo)

class Shuffle extends Algo<[], void, Bars> {
    name = "Shuffle";

    env: SortEnv;

    async body() {
        const l = this.env.data.length;
        const count = 2*l;

        for(let i = 0; i < count; i++){
            let first = Math.floor(this.env.random() * l);
            let second = Math.floor(this.env.random() * l);

            swap(this.env.data, first, second);

            //await this.env.breakpoint()
        }
    }

    constructor(env: SortEnv) {
        super(env)
        this.env = env;
    }
}

export const shuffle = () => (env: SortEnv) => new Shuffle(env);

class ShuffleList extends Algo<[], void, BarList> {
    name = "ShuffleList";

    env: MergeSortEnv;

    async body() {
        const l = this.env.data[0].length;
        const count = 2*l;

        for(let i = 0; i < count; i++){
            let first = Math.floor(this.env.random() * l);
            let second = Math.floor(this.env.random() * l);

            swap(this.env.data[0], first, second);

            //await this.env.breakpoint()
        }
    }

    constructor(env: MergeSortEnv) {
        super(env)
        this.env = env;
    }
}

export const shuffleList = () => (env: MergeSortEnv) => new ShuffleList(env);

export const swap = (bars: Bars, A: number, B: number) => {
    const temp = bars[A];
    bars[A] = bars[B];
    bars[B] = temp;
}