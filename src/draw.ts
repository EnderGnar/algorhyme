export class DrawOptions {
    stroke?: string;
    fill?: string;
    width?: number;

    font?: string;
    font_size?: number;
}

export interface Drawable {
    draw: (draw: DrawContext) => void
}

export interface DrawWithInfo<I> {
    draw_info: (draw: DrawContext, info: I) => void
}

export interface Informing<I> {
    create_info: () => I
}

export type Pos = {
    x: number, y: number,
}

/**
 *  Screen dimensions should be made for 16:9
 */

export abstract class DrawContext {
    //Clears the screen if needed.
    abstract clear(): void;

    abstract rect(
        center: Pos, w:number, h:number, 
        options?: DrawOptions
    ): void;

    abstract circle(
        center: Pos, r: number,
        options?: DrawOptions
    ): void;

    abstract line(
        p1: Pos, p2: Pos,
        options?: DrawOptions
    ): void;

    abstract text(
        text: string, {x, y}: Pos,
        options?: DrawOptions
    ): void;
}