import { Env } from "./env";

export interface Runnable {
    run:() => Promise<any>;
}


export abstract class Algo<T extends Array<any>, G> implements Runnable{
    abstract name: string;
    arguments: T;

    abstract body(...args:T): Promise<G>;
    
    env: Env<any>;

    constructor(env: Env<any>, ...args: T){
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