import { Data, Env } from "../env"
import { Algo } from "../algorithm"
import { Drawable, DrawContext } from "../draw";

type TowerKey = "A" | "B" | "C";

class Towers implements Drawable, Data{
    n: number;

    A:number[] = [];
    B:number[] = [];
    C:number[] = [];

    get(key: TowerKey){
        if(key == "A") return this.A
        if(key == "B") return this.B
        if(key == "C") return this.C
        return this.A
    }

    draw(draw: DrawContext){
        const towers = [this.A, this.B, this.C];
        const sixth = 100/6;

        const min_width = 5;
        const width_increase = 2;
        const height = 2;


        for(let i = 0; i < 3; i++) {
            const offset = (1+2*i)*sixth;
            
            //draw stick
            draw.rect(
                {x: offset, y: 25}, 2, 50,
                {fill:"brown"}    
            );

            let c = 0;
            for(let disk of towers[i]) {
                const width = min_width + width_increase*(disk-1);
                const color = `hsl(${disk*360 / 20}, 100%, 50%)`;

                draw.rect({x: offset, y:(c+0.5)*height+4}, width, height,
                    {fill: color}
                );

                c++;
            }
        }

        //draw grass
        draw.rect({x:50, y: 2}, 100, 4,
            {fill:"#aaaaaa", stroke:"#aaaaaa"}
        ); 
    }


    reset() {
        this.A = new Array(this.n).fill(0).map((_,i) => this.n-i)
        this.B = []
        this.C = []
    }

    constructor(n: number) {
        this.n = n;
        this.reset();
    }
}

export class HanoiEnv extends Env<Towers> implements Drawable{
    draw(draw: DrawContext){
        this.data.draw(draw);
    }
    data = new Towers(5);
}

export type HanoiParameter = [number, TowerKey, TowerKey, TowerKey];

class HanoiAlgo extends Algo<HanoiParameter, void, Towers> {
    name = "Hanoi";

    async body(height: number, from: TowerKey, to: TowerKey , spare: TowerKey){
        if (height <= 0)
                return;

        await this.env.run(hanoi(height - 1, from, spare, to));

        await this.move(from, to);

        await this.env.run(hanoi(height - 1, spare, to, from));
    }
    
    async move(from: TowerKey, to: TowerKey){
        await this.env.breakpoint();
        this.env.data.get(to).push(this.env.data.get(from).pop()!);
    }
}

export const hanoi = (...args: HanoiParameter) => (env: Env<Towers>) => {
    return new HanoiAlgo(env, ...args);
}
