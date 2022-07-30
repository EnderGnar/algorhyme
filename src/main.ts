import { Env } from "./env";
import { call } from "./algo/call";



class TestEnv extends Env<any> {
    data = undefined;
}

let env = new TestEnv();

env.run(call());

function loop() {
    env.step();
}

setInterval(loop, 100);