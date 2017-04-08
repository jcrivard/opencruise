/* eslint-disable */
class Cruise {
    constructor (parms) {
        this.cruiseid = null;
        this.cruiseName = parms.cruiseName;
        this.people = parms.people;
        this.date = new Date().toJSON().slice(0, 10);
        this.BAF = parms.BAF;
        this.multiProducts = false;
        this.defaultSpecies = parms.defaultSpecies;
        this.field2 = {
            name: parms.field2.name,
            min: parms.field2.min,
            max: parms.field2.max
        };
        this.field3 = {
            name: parms.field3.name,
            min: parms.field3.min,
            max: parms.field3.max,
            field2Min: parms.field3.field2Min  //field2min - min value for field2 for field3 to be > 0; ie. min DBH of 11 for sawlogs
        };
        this.field4 = {
            name: parms.field4.name,
            min: parms.field4.min,
            max: parms.field4.max
        };
        this.plots = [];
    }
}

class DefaultCruise {
    constructor () {
        this.cruiseid = null;
        this.cruiseName = 'New Cruise';
        this.people = 'Jim Rivard';
        this.date = new Date().toJSON().slice(0, 10);
        this.BAF = 10;
        this.multiProducts = false;
        this.defaultSpecies = 'HM';
        this.field2 = {
            name: 'DBH',
            min: 5,
            max: 62
        };
        this.field3 = {
            name: 'Saw',
            min: 0,
            max: 10,
            field2Min: 11  //field2min - min value for field2 for field3 to be > 0; ie. min DBH of 11 for sawlogs
        };
        this.field4 = {
            name: 'Pulp',
            min: 0,
            max: 12
        };
        this.plots = [];
    }
}

class Species {
    constructor () {
        this.key = '';
        this.names = ['', '', ''];
    }
}

class SpeciesKey {
    constructor () {
        this.species = [
            {key: 'HM', names: ['hard maple', 'sugar maple', '']},
            {key: 'RM', names: ['red maple', 'soft maple', '']},
            {key: 'AS', names: ['aspen', '', '']},
            {key: 'RO', names: ['red oak', '', '']},
            {key: 'BF', names: ['balsam fir', '', '']},
            {key: 'YB', names: ['yellow birch', '', '']},
            {key: 'PB', names: ['paper birch', 'white birch', '']},
            {key: 'BW', names: ['basswood', '', '']},
            {key: 'WA', names: ['white ash', '', '']},
            {key: 'BA', names: ['black ash', '', '']},
            {key: 'BC', names: ['black cherry', '', '']},
            {key: 'BP', names: ['balsam poplar', '', '']},
            {key: 'WP', names: ['white pine', '', '']},
            {key: 'RP', names: ['red pine', '', '']},
            {key: 'JP', names: ['jack pine', '', '']},
            {key: 'WS', names: ['white spruce', '', '']},
            {key: 'BS', names: ['black spruce', '', '']},
            {key: 'TM', names: ['tamarack', '', '']},
            {key: 'WC', names: ['white cedar', 'cedar', '']},
            {key: 'EH', names: ['hemlock', '', '']},
            {key: 'AE', names: ['elm', '', '']},
            {key: 'IW', names: ['ironwood', '', '']},
            {key: 'MA', names: ['mountain ash', '', '']},
            {key: 'SNAG', names: ['snag', '', '']}
        ]
    }
}
class Grade {
    constructor () {
        this.name = '';
    }
}
class GradeKey {
    constructor () {
        this.grades = [
            { name: '1' },
            { name: '2' },
            { name: '3' },
            { name: 'Bolt' },
            { name: 'V' },
            { name: 'C' },
            { name: 'Pulp' }
        ];
    }
}
class BAF {
    constructor () {
        this.value = 99;
    }
}
class BAFArray {
    constructor () {
        this.values = [
            { value: 10 },
            { value: 20 },
            { value: 40 },
            { value: 80 }
        ];
    }
}
const ConfigParms = {
    configid: 1,
    cruiseParms: new DefaultCruise(),
    speciesKey: new SpeciesKey(),
    gradeKey: new GradeKey(),
    bafArray: new BAFArray(),
}
const DBPARMS = {
    name: 'CRUISEDB',
    version: 3,
    stores: [
        {
            storeName: 'cruise',
            keyPath: 'cruiseid',
            autoIncrement: true,
            indexes: [ {name: 'cruiseid', fields: 'cruiseid', unique: true} ]
        },
        {
            storeName: 'config',
            keyPath: 'configid',
            autoIncrement: true,
            indexes: [ {name: 'configid', fields: 'configid', unique: true} ]
        }
    ]
}
export { Species, Grade, BAF, ConfigParms, DBPARMS, Cruise};
