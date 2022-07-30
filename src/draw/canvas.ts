import { DrawContext, DrawOptions, Pos } from "../draw";


export class CanvasContext extends DrawContext{
    ctx: CanvasRenderingContext2D;

    width: number;
    height: number;

    offset: Pos = {
        x:0, y:0
    };

    user_scale = 1;

    font = {
        name: "sans-serif",
        size: 10
    };

    default:{
        align: CanvasTextAlign,
        baseline: CanvasTextBaseline
    } = {
        align: "center",
        baseline: "middle",
    };

    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    rect(center: Pos, w: number, h: number, options?: DrawOptions): void {
        if(options) this.style(options);

        let c = this.p(center)
        let width = w*this.scale
        let height = h*this.scale

        this.ctx.beginPath();
        this.ctx.rect(c[0]-width/2, c[1]-height/2, width, height);
        if(options){
            if(options.fill) this.ctx.fill();
            if(options.stroke) this.ctx.stroke();
        }
    }
    circle(middle: Pos, r: number, options?: DrawOptions): void {
        if(options) this.style(options);

        this.ctx.beginPath();
        this.ctx.arc(...this.p(middle), r*this.scale, 0, Math.PI*2);
        
        if(options){
            if(options.fill) this.ctx.fill();
            if(options.stroke) this.ctx.stroke();
        }
    }
    line(p1: Pos, p2: Pos, options?: DrawOptions): void {
        if(options) this.style(options);

        this.ctx.beginPath();
        this.ctx.moveTo(...this.p(p1));
        this.ctx.lineTo(...this.p(p2));

        this.ctx.stroke();
    }
    text(text: string, middle: Pos, options?: DrawOptions): void {
        if(options) this.style(options);

        this.setFont();

        if(options){
            if(options.fill) this.ctx.fillText(text, ...this.p(middle));
            if(options.stroke) this.ctx.strokeText(text, ...this.p(middle));
        }
    }
    reset(){
        this.ctx.clearRect(0,0, this.width, this.height);

        this.ctx.textAlign = this.default.align;
        this.ctx.textBaseline = this.default.baseline;
    }

    setFont(){
        this.ctx.font = `${this.font.size*this.scale}px ${this.font.name}`;
    }

    p({x, y}: Pos): [number, number] {
        return [
            (x-this.offset.x)*this.scale, 
           this.height-(y-this.offset.y)*this.scale,
        ];
    }

    style({stroke, fill, width, font, font_size}: DrawOptions){
        if(stroke) this.ctx.strokeStyle = stroke;
        if(fill) this.ctx.fillStyle = fill;
        if(width) this.ctx.lineWidth = width*this.scale;

        if(font) this.font.name = font;
        if(font_size) this.font.size = font_size;
    }

    get scale(){
        return (this.width/100)*this.user_scale
    }

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.ctx = canvas.getContext("2d")!;
        this.width = canvas.width;
        this.height = canvas.height;
    }
}