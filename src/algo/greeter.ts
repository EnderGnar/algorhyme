import { Algo } from "../algo";
import { Env } from "../env";

//Greeter
export class Greeter extends Algo<[string], string> {
    name = "greeter";
    body = async (name: string) => {
        let greeting = `Hello ${name}`;
        return greeting;
    };

    constructor(env: Env<any>, name: string) {
        super(env, name);
    }
}

export const greeter = (name: string) => {
    return (env: Env<any>) => {new Greeter(env, name)}
}