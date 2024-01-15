import { Algo } from "../algorithm";
import { Env } from "../env";

//Call examples
class Call extends Algo<any[], void, any> {
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
}

export const call = () => {
    return (env: Env<any>) => {return new Call(env);}
};
