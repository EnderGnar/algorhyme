import { BreakableEnv } from "./breakable";
import { call } from "./algo/call";



class TestEnv extends BreakableEnv<any> {
    data = undefined;
}

let env = new TestEnv();

env.run(call());

function loop() {
    env.step();
}

setInterval(loop, 100);