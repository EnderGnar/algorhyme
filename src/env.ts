import { Algo, Runnable } from "./algo";


export abstract class Env<D>{
    abstract data: D;
    queue: Runnable[] = [];

    run<T extends Array<any>, G>(algo: (env: this) => Algo<T,G>): Promise<G>{
        return algo(this).run();
    }
}

