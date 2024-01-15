import { Algo } from "../algorithm";
import { Env } from "../env";

//Greeter
export class Greeter extends Algo<[string], string, any> {
    name = "greeter";
    body = async (name: string) => {
        let greeting = `Hello ${name}`;
        return greeting;
    };
}

export const greeter = (name: string) => {
    return (env: Env<any>) => {new Greeter(env, name)}
}
