import { BarInfo, Bars, emptyBarInfo } from "../data/bars";
import { Drawable, DrawContext, DrawWithInfo, Informing } from "../draw";
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