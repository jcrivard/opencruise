/* eslint-disable */
import { Tree } from './tree';

export class Plot {
    constructor(plotnum, defaultSpecies) {
        this.plotnum = plotnum;
        this.trees = [];
        this.plotID = this.plotnum.toString();
        this.multiProducts = false;
        this.position = {};
        for (let i = 0; i < 10; i++) {
            this.trees.push(new Tree(defaultSpecies));  //add 10 empty trees to new plot
        }

    }
}
