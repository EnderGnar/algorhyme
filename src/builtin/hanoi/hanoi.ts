import { Algorithm, LocalInit, register_void_locals } from "../../algorithm";
import { Command, defaultCommandBuilder, heapCommandBuilder } from "../../command";
import { Machine } from "../../machine";
import { TowerKey, Towers } from "./towers";

// The arguments for the algorithm. We declare them in such a way because they must be initialized by the Command.
type HanoiArgs = [Towers, TowerKey, TowerKey, TowerKey, number]

// The Hanoi algo moves all plates from to, using.
export const hanoi: Algorithm<HanoiArgs, void> = async (_locals, machine, towers, from, to, using, height) => {
    if (height <= 1) {
        return await machine.call(move, towers, from, to);
    }

    await machine.call(hanoi, towers, from, using, to, height-1);
    await machine.call(move, towers, from, to);
    await machine.call(hanoi, towers, using, to, from, height-1);
}
register_void_locals(hanoi);


// Move the upper most plate.
const move: Algorithm<[Towers, TowerKey, TowerKey], void> = async (_l, m, towers, from, to) => {
    await m.break();
    let plate = towers[from].pop()!
    await m.break();
    towers[to].push(plate);
}
register_void_locals(move);




// The command. Setting up the lowest layer correcly.
export const hanoiCommand = (id: number, from: TowerKey, to: TowerKey): Command<HanoiArgs> => ({
    init: (machine: Machine) => {
        let obj = machine.heap.get(id);
        if(obj == undefined) throw "No object found!";
        let towers = obj as Towers;
        
        let tower_keys: TowerKey[] = ["A", "B", "C"];
        let using = tower_keys.filter(x => !(x == from || x == to))[0]!;
        console.log(using);
        return [hanoi, [towers, from, to, using, towers[from].length]]
    },
    cleanup: ()=>{}
})
