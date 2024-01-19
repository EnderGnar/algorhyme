import { Machine } from "./machine";

export type LocalInit<T> = () => T;
export type Args = Array<any>
export type Algorithm<A extends Args, T> = (locals: T, machine: Machine, ...args: A) => Promise<number | undefined | void>;

export function register_void_locals<T>(algo: Algorithm<any, T>) {
    Machine.initializers.set(algo, () => {});
}

export function register_default_locals<T>(algo: Algorithm<any, T>, proto: T) {
    Machine.initializers.set(
        algo,
        () => ({...proto})
    );
}
