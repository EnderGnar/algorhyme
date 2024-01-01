import { Data } from "../env"

export enum TokenType {
    Number,
    Char
}

export type Token = {
    ty: TokenType,
    val: string | number
}

export function number_token(num: number): Token{
    return {
        ty: TokenType.Number,
        val: num
    }
}

export function char_token(char: string): Token {
    return {
        ty: TokenType.Char,
        val: char
    }
}

export class Tokens extends Array<Token> implements Data {
    source = "1+(2+3)"
    count: number;
    reset() {
        this.count = this.source.length;
        for(let i = 0; i < this.count; ++i){

        }
    }


    constructor(source: string){
        super();
        this.source = source;
        this.count = source.length;
    }
}