/* eslint-disable */
import { Plot } from '../models/plot';
import { DatabaseService }  from './database';
import { ConfigParms, Cruise } from '../models/config';

/******************************************************************** */
/** CRUISESTORE SERVICE                                                */
/******************************************************************** */

class CruiseStore  {
    constructor () {
        this.cruises = [];
        //this.config = ConfigParms(); // 'new CONFIG' loads defaults
        this.isOpen = false;
        this.db =  new DatabaseService();
        this.state = {
            cruiseList: [],
            config: ConfigParms
        }
        this.loadStore();
    }

    loadStore() {
        this.db.open().then(results => {
            return this.db.select('cruise', '', '', '')
        }).then(results => {
            this.isOpen = true;  //store is open for business; set here so that when cruiselist is updated in processcruises, observers will see store open
            this.state.cruiseList = results;
            return this.db.select('config','','','')  //load config into store
        }).then(results => {
            if (results[0]) { this.state.config = results[0];}  //used saved if exists
        }).catch(error => {
            console.log('Error loading initial data: ' + error);
        });
    }
    newCruise() {
        return new Promise((resolve, reject) => {
            var parms = Object.assign({}, this.state.config.cruiseParms);
            var self = this;
            var processCruise = function (results) { //resultSet is array, should only be one item
                var createdCruise = new Cruise();
                createdCruise.cruiseid = results[0].insertId;
                self.state.cruiseList.unshift(createdCruise);
                console.log('Cruise created.');
                resolve(results);
            };
            delete parms.cruiseid;
            this.db.insert('cruise', [parms]).then(results => {
                return processCruise(results);
            }).catch(error => {
                reject('Error accessing database: ' + error);
            });
        });
    }
    getCruise(cruiseid) {
        return new Promise((resolve, reject) => {
            let cruiseIndex = this.state.cruiseList.findIndex(item => item.cruiseid === cruiseid);
            let jim = this.state.cruiseList[cruiseIndex];
            resolve(this.state.cruiseList[cruiseIndex]);
        });
    }
    getConfig() {
        return new Promise((resolve, reject) => {
            resolve(this.state.config);
        });
    }
    newPlot(cruiseid) {
        return new Promise((resolve, reject) => {
            let index = this.state.cruiseList.findIndex(item => item.cruiseid === cruiseid); //get index of local cruise
            let maxPlotNum = this.state.cruiseList[index].plots.reduce((pre, cur) => {
                return Math.max(pre, cur.plotnum);
            }, 0);
            let defaultSpecies = this.state.cruiseList[index].defaultSpecies;
            let plot = new Plot(maxPlotNum + 1, defaultSpecies);
            this.state.cruiseList[index].plots.unshift(plot); //add plot to cruise
            resolve(plot);
        });
    }
    updatePlot(cruiseid, plot) {
        return new Promise((resolve, reject) => {
            let index = this.state.cruiseList.findIndex(item => item.cruiseid === cruiseid); //get index of local cruise
            let plots = this.state.cruiseList[index].plots;
            let plotIndex = plots.findIndex(item => item.plotnum === plot.plotnum); //get index of plot
            if (plotIndex > -1) { //plot already exists
                plots[plotIndex] = plot; //existing plot, replace plot
            } else {
                plots.unshift(plot); //new plot, add plot to plots array
            }
            let updateObj = {cruiseid: cruiseid, plots: plots}; //prepare for update
            this.updateCruise(updateObj).then(result => {  //update database
                console.log('Plot updated.' + plot.plotnum);
                resolve(plot);
            }).catch(error => {
                console.error('Database error updating plot: ' + error);
                reject(error);
            });
        });
    }
    updateCruise(updateObj) { //all updates to a cruise should be handled here
        return new Promise((resolve, reject) => {
            let index = this.state.cruiseList.findIndex(item => item.cruiseid === updateObj.cruiseid); //get index of local cruise
            let cruise = this.state.cruiseList[index]; //get cruise object
            for (let prop in updateObj) { //update properties with new values
                cruise[prop] = updateObj[prop];
            }
            this.state.cruiseList[index] = cruise // replace cruise object with updated version
            this.db.update('cruise', cruise, cruise.cruiseid).then(result => { //update database
                resolve(result);  //should only be one result
            })
            .catch(error => {
                console.error('Database error updating cruise: ' + error);
                reject(error);
            });
        });
    }
    updateConfig(newConfig) { //all updates to config should be handled here
        return new Promise((resolve, reject) => {
            this.state.config = newConfig;  //update config observable
            this.db.update('config', newConfig, newConfig.configid).then(result => { //update database
                resolve(result);  //should only be one result
            })
            .catch(error => {
                reject('Database error updating cruise: ' + error);
            });
        });
    }
    deleteCruise(cruiseid) {
        return new Promise((resolve, reject) => {
            this.db.deleteItem('cruise', cruiseid).then(result => {
                let jim = this.state.cruiseList;
                let index = this.state.cruiseList.map(item => { return item.cruiseid; }).indexOf(cruiseid);
                this.state.cruiseList.splice(index, 1);
                console.log('CruiseID: ' + cruiseid + ' deleted.');
                resolve(result);
            }).catch(error => {
                reject('Database error deleting cruise: ' + error);
            });
        });
    }
}

const cruiseStore = new CruiseStore();
export { cruiseStore };
