export type TowerKey = "A" | "B" | "C";

export type Towers = {
    [id in TowerKey]: number[];
};

export function towers(n: number): Towers {
    let A = Array(n).fill(0).map((_0, i) => n-i);

    return {
        A,
        B: [],
        C: [],
    }
}


/*
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
*/
