import { Algo } from "../algo";
import { BreakableEnv } from "../breakable";

//Call examples
class Call extends Algo<any[], void> {
    env: BreakableEnv<any>;
    name= "empty call";
    arguments= [];
    async body() {
        console.log("before breakpoint");
        await this.env.breakpoint();
        
        for(let i = 0; i < 10; i++){
            console.log(i);
            await this.env.breakpoint();
        }

    };

    constructor(env: BreakableEnv<any>) {
        super(env);
        this.env = env;
    }
}

export const call = () => {
    return (env: BreakableEnv<any>) => {return new Call(env);}
};