import { Algo } from "../algorithm";
import { Drawable, DrawContext } from "../draw";
import { Data, Env } from "../env";
import { RandomEnv } from "../random";

type CoinsSide = "Heads" | "Tails" | "Flipping"

class Coin implements Drawable, Data {
    state: CoinsSide = "Flipping";

    reset() {
        this.state = "Flipping"
    }
    draw(draw: DrawContext){
        const middle = {x: 50, y: 25}

        switch(this.state) {
            case "Flipping":
                draw.rect(middle, 20, 20, {stroke:"black"})
                break;
            case "Heads":
            case "Tails":
                draw.circle(middle, 10, {stroke: "black"})
                draw.text(this.state, middle, {font_size: 5, fill: "black"})
                break;
        }
    };
    
    constructor(){
        this.reset()
    }
}

export class CoinEnv extends RandomEnv<Coin> implements Drawable {
    draw(draw: DrawContext){
        this.data.draw(draw);
    }
    data = new Coin();
}


class CoinFlip extends Algo<[], void, Coin> {
    env: CoinEnv;
    name = "CoinFlip";
    async body() {
        await this.env.breakpoint();
        this.env.data.state = (this.env.random() < 0.5) ?"Heads":"Tails";
    }

    constructor(env: CoinEnv) {
        super(env);
        this.env = env;
    }
}

export const coin_flip = () => (env: CoinEnv) => {
    return new CoinFlip(env);
}
