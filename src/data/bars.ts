import { Algo } from "../algo";
import { Drawable, DrawContext, DrawWithInfo } from "../draw";
import { Data } from "../env";
import { SortEnv } from "../env/sort_env";

export type Bar = {
    value: number;
}

export type BarInfo = ({
    index: number,
    color: string
})[]

export class Bars extends Array<Bar> implements Data, Drawable, DrawWithInfo<BarInfo>{
    count: number;
    reset(){
        for(let i = 0; i < this.count; i++) {
            this[i] = {value: i+1}
        }
    };

    draw(draw: DrawContext){
        this.draw_info(draw, [])
    };

    draw_info(draw: DrawContext, info: BarInfo){
        const width = 90 / this.length;
        const height = 50 / this.length;

        for(let i = 0; i < this.length; i++){
            const value = this[i].value
            const color = `hsl(${value*340 / this.length}, 100%, 69%)`
            
            draw.rect({x: 5 + width * (i+1/2), y: 1 + height*((value+1)/2)}, width*0.8, height*value, {fill: color})
        }

        for(let {index, color} of info) {
            const value = this[index].value
            draw.rect({x: 5 + width * (index+1/2), y: 1 + height*((value+1)/2)}, width*0.8, height*value, {stroke: color, width: 0.5})
        }
    };

    constructor(count: number){
        super()
        this.count = count;
        this.reset();
    }
}

class Shuffle extends Algo<[], void, Bars> {
    name = "Shuffle";

    env: SortEnv;

    async body() {
        const l = this.env.data.length;
        const count = 2*l;

        for(let i = 0; i < count; i++){
            let first = Math.floor(this.env.random() * l);
            let second = Math.floor(this.env.random() * l);

            const temp = this.env.data[first];
            this.env.data[first] = this.env.data[second];
            this.env.data[second] = temp;

            //await this.env.breakpoint()
        }
    }

    constructor(env: SortEnv) {
        super(env)
        this.env = env;
    }
}

export const shuffle = () => (env: SortEnv) => new Shuffle(env);