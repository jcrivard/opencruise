/* eslint-disable */
import { Tree } from './tree';

function getPosition() {
    return new Promise((resolve, reject) => {
        var newPosition = {coords: { accuracy: null, latitude: null, longitude: null }};
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                newPosition.coords.accuracy = position.coords.accuracy;
                newPosition.coords.latitude = position.coords.latitude;
                newPosition.coords.longitude = position.coords.longitude;
                console.log('plot.updatePosition - lat: ' + position.coords.latitude + ', long: ' + position.coords.longitude);
                resolve(newPosition);
            }, error => {
                console.log('plot.updatePosition - unable to get current position.');
                resolve(newPosition);
            },
                {timeout: 50000, maximumAge: 0, enableHighAccuracy: true}
            );
        } else {
            resolve(newPosition);
        }
    });
}

export class Plot {
    constructor(plotnum, defaultSpecies) {
        this.plotnum = plotnum;
        this.trees = [];
        this.plotID = this.plotnum.toString();
        this.multiProducts = false;
        getPosition().then(position => {
            this.position = position;
            for (let i = 0; i < 10; i++) {
                this.trees.push(new Tree(defaultSpecies));  //add 10 empty trees to new plot
            }
        });
    }
}
