import { Data, Env } from "./env";
import RandomFactory from "seedrandom";

export abstract class RandomEnv<D extends Data> extends Env<D> {
    seed: string = "random";
    generator = RandomFactory(this.seed);
    random() {
        return this.generator()
    }

    set_seed(seed: string) {
        this.seed = seed;
        this.generator = RandomFactory(this.seed);
    }
}