import { Machine } from "./machine";

export type LocalInit<T> = () => T;
export type Args = Array<any>
export type Algorithm<A extends Args, T> = (locals: T, machine: Machine, ...args: A) => Promise<number | undefined | void>;
