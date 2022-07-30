import { Env } from "./env";

export interface Runnable<G, D> {
    run:() => Promise<G>;
}


export abstract class Algo<T extends Array<any>, G, D> implements Runnable<G, D>{
    abstract name: string;
    arguments: T;

    abstract body(...args:T): Promise<G>;
    
    env: Env<D>;

    constructor(env: Env<D>, ...args: T){
        this.env = env
        this.arguments = args;
    }

    async run() {
        return await this.body(...this.arguments);
    }
    
    toString(){
        return `${this.name}(${this.arguments.join(', ')})`
    };
}