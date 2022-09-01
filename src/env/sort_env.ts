import { BarInfo, BarList, BarListInfo, Bars, emptyBarInfo, emptyBarListInfo } from "../data/bars";
import { Drawable, DrawContext, Informing } from "../draw";
import { Env } from "../env";
import { RandomEnv } from "../random";

export class SortEnv extends RandomEnv<Bars> implements Drawable{
    data: Bars;
    
    draw(draw: DrawContext){
        let info: BarInfo = emptyBarInfo(this.data);

        const current = this.stack[this.stack.length - 1] as any

        if(this.stack.length > 0 && typeof current.create_info == "function"){
            const informing = current as Informing<BarInfo>

            info = informing.create_info()
        }

        this.data.draw_info(draw, info);
    };

    constructor(count: number) {
        super()
        this.data = new Bars(count);
    }
}


export class MergeSortEnv extends RandomEnv<BarList> implements Drawable{
    data: BarList;
    
    draw(draw: DrawContext){
        let info: BarListInfo = emptyBarListInfo(this.data);

        const current = this.stack[this.stack.length - 1] as any

        if(this.stack.length > 0 && typeof current.create_info == "function"){
            const informing = current as Informing<BarListInfo>

            info = informing.create_info()
        }

        this.data.draw_info(draw, info);
    };

    constructor(count: number) {
        super()
        this.data = new BarList(count);
    }
}