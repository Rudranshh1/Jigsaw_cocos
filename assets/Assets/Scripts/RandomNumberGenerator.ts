import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RandomNumberGenerator')
export class RandomNumberGenerator{
    private numbers: number[] = [];
    private index = 0;
    private length = 0;
    constructor(length) {
        this.length = length;
        this.reset();
    }

    private reset() {
        this.numbers = Array.from({ length: this.length }, (_, i) => i);
        this.shuffle(this.numbers);
        this.index = 0;
    }

    private shuffle(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getNext(): number {
        if (this.index >= this.numbers.length) {
        this.reset(); // restart with a new random order
        }
        return this.numbers[this.index++];
    }
}

