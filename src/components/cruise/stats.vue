<template>
    <div>
        <div class="stats-container" style="flex-direction:row">
            <span class="stats-item">Total Plots:  {{stats.totalPlots}}</span>
            <span class="stats-item">Total Trees:  {{stats.totalTrees}}</span>
            <span v-if="statsType === 'BA'" class="stats-item">Avg BA/Acre: {{stats.avgBA}}</span>
            <span v-if="statsType === 'Diameter'" class="stats-item">Quadratic Mean Diameter: {{stats.avgDiameter}}</span>
        </div>
        <div class="app-grid-2">
            <div class="stats-container stats-container-inline">
                <label>
                    <input type="radio" class="stats-radio" name="statsType" id="stats-type-BA" value="BA" v-model="statsType" v-on:change="computeStats('UPDATE-VALUES')">
                    BA/Acre
                </label>
            </div>
            <div class="stats-container stats-container-inline">
                <label>
                    <input type="radio" class="stats-radio" name="statsType" id="stats-type-diameter" value="Diameter" v-model="statsType" v-on:change="computeStats('UPDATE-VALUES')">
                    Quadratic Mean Diameter
                </label>
            </div>
        </div>
        <div class="app-grid-2">
            <div class="stats-container" style="text-align: center">
                <label>Include Species</label>
                <select multiple v-model="includedSpecies" placeholder="Include" v-on:change="computeStats('INCLUDE-SPECIES')">
                    <option v-for="species in allSpecies"  :key="species.key" v-bind:value="species.key">
                        {{species.key}}
                    </option>
                </select>
            </div>
            <div class="stats-container" style="text-align: center">
                <label>Exclude Species</label>
                <select multiple v-model="excludedSpecies" placeholder="Include" v-on:change="computeStats('EXCLUDE-SPECIES')">
                    <option v-for="species in allSpecies"  :key="species.key" v-bind:value="species.key">
                        {{species.key}}
                    </option>
                </select>
            </div>
        </div>
        <div class="app-grid-2">
            <div class="stats-container" v-for="(val, itemNum) in confidenceVals">
                <div class="stats-input-container">
                    <div class="stats-input-header stats-input-item">Interval {{itemNum + 1}}</div>
                    <div class="stats-input-item">Percent</div>
                    <div class="stats-input-item">Value</div>
                    <input class="stats-input" required v-bind:id="'Interval' + itemNum" type="number" v-model="val.CI" v-on:change="computeStats('UPDATE-VALUES')"/>
                    <input class="stats-input" required v-bind:id="'IntervalValue' + itemNum" type="number" v-model="val.CIValue" v-on:change="computeStats('UPDATE-PERCENTS')"/>
                </div>
                <div class="stats-input-container">

                    <select class="app-select" v-bind:id="'Level' + itemNum" v-model="val.CL" v-on:change="computeStats()">
                        <option v-for="cl in validCLs" v-bind:value="cl.CL" :key="val.CI">
                            {{cl.CL}}%
                        </option>
                    </select>
                    <label class="app-select-label" v-bind:for="'Level' + itemNum">Level {{itemNum + 1}}</label>
                </div>
            </div>
        </div>
        <div class="app-grid-2">
            <div class="stats-container" style="text-align: center" v-for="cv in stats.confidenceValues">
                <div >
                    <div> {{cv.plotsRequired}} plots required for</div>
                    <div>+/- {{cv.CI}}% {{statsType}} at {{cv.CL}}%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Stats } from '../../models/stats'
    export default {
        name: 'cruise-stats',
        props: ['cruise', 'showStats', 'allSpecies'],
        inject: ['cruiseStore'],
        data () {
            return {
                stats: {},
                statsType: 'BA',
                confidenceVals: [{CI: 10, CL: 95, plotsRequired: null, CIValue: null}, {CI: 20, CL: 95, plotsRequired: null, CIValue: null}], //default CIs; need to setup config option,
                excludedSpecies: [],
                includedSpecies: [],
                fullSpeciesList: [],
                validCLs: [ //valid probabilities (confidence limits) along with T-Value for infinite population
                    {CL: 99, T: 2.576},
                    {CL: 95, T: 1.960},
                    {CL: 90, T: 1.645},
                    {CL: 80, T: 1.282},
                    {CL: 70, T: 1.036}
                ]
            }
        },
        created() {
            for (let species of this.allSpecies) { //populate species array with all species to start; user can turn off species as needed
                this.includedSpecies.push(species.key);
            }
            this.fullSpeciesList = this.includedSpecies.slice(0); //make a copy to have all species for use below
            this.computeStats();
            this.updateValues(); //need to compute values after stats generated since we need the mean BA/diameter
        },
        methods: {
            closeDialog() {
                this.$refs.statsRef.close();
            },
            sendCloseStatsEvent() {
                this.$emit('closeStats');  //to be consistent, we let parent close dialog by toggling showPlotList
            },
            updatePercents() {
                this.confidenceVals.forEach(confidenceVal => {
                    let newPercent = this.statsType === 'BA' ? confidenceVal.CIValue / this.stats.avgBA : confidenceVal.CIValue / this.stats.avgDiameter;
                    confidenceVal.CI = Math.round(newPercent * 10000) / 100; //round to 2 decimals
                })
            },
            updateValues() {
                this.confidenceVals.forEach(confidenceVal => {
                    let newValue = this.statsType === 'BA' ? confidenceVal.CI / 100 * this.stats.avgBA : confidenceVal.CI / 100 * this.stats.avgDiameter;
                    confidenceVal.CIValue = Math.round(newValue * 100) / 100;
                })
            },
            computeStats(flag = '') {
                let speciesList = this.fullSpeciesList.slice(0); //make a copy to work with
                if (flag === 'EXCLUDE-SPECIES') { //need to update include species list to reflect new exclusion
                    this.excludedSpecies.forEach((species) => {
                        speciesList.splice(speciesList.indexOf(species), 1); //remove species from included list
                    });
                    this.includedSpecies = speciesList.slice(0);
                } else if (flag === 'INCLUDE-SPECIES') { //need to update exclude species list to reflect new inclusion
                    this.includedSpecies.forEach((species) => {
                        speciesList.splice(speciesList.indexOf(species), 1); //remove species from included list
                    });
                    this.excludedSpecies = speciesList.slice(0);
                } else if (flag === 'UPDATE-PERCENTS') {
                    this.updatePercents();
                } else if (flag === 'UPDATE-VALUES') {
                    this.updateValues();
                }
                let avgBAByPlot = this.getBAByPlot(this.cruise);
                let avgDiameterByPlot = this.getQMDByPlot(this.cruise);
                this.stats = this.processPlotSummaryData(avgBAByPlot, avgDiameterByPlot, this.cruise, this.confidenceVals);
                this.updateValues(); //need to recompute in the event that include/exclude species list changed
            },
            numPlotsRequired(CI, CL, plotSummaryData, numPlots, mean, BAF) {
                var tObj = this.validCLs.find(item => { //should only be one result returned
                    return item.CL === CL;
                });
                var t = tObj.T;  //get t value
                var stdDev = this.stdDeviation(plotSummaryData, numPlots);  //get stddev in expressed as BA/acre
                var CV = (stdDev / mean) * 100; //coeffecient of variation in percent
                var A = CI; //in percent (ie. 10 and not .1)
                var requiredPlots = Math.pow(((t * CV) / A), 2);
                return Math.round(requiredPlots);
            },
            processPlotSummaryData(avgBAByPlot, avgDiameterByPlot, cruise, confidenceArray) {
                let stats = new Stats();
                stats.totalTrees = avgBAByPlot.reduce((sum, curr) => { return sum + curr; }, 0) / cruise.BAF;
                stats.totalPlots = cruise.plots.length;
                stats.avgBA = Math.round((stats.totalTrees * cruise.BAF) / stats.totalPlots);
                stats.avgDiameter = Math.round((avgDiameterByPlot.reduce((sum, diameter) => { return sum + diameter; }, 0) / stats.totalPlots) * 100) / 100;
                let results = confidenceArray.map(item => {
                    let plotsRequired = null;
                    if (this.statsType === 'BA') {
                        plotsRequired = (this.numPlotsRequired(item.CI, item.CL, avgBAByPlot, stats.totalPlots, stats.avgBA, cruise.BAF));
                    } else if (this.statsType === 'Diameter') {
                        plotsRequired = (this.numPlotsRequired(item.CI, item.CL, avgDiameterByPlot, stats.totalPlots, stats.avgDiameter, cruise.BAF));
                    }
                    stats.confidenceValues.push({CI: item.CI, CL: item.CL, plotsRequired: plotsRequired});
                });
                return stats;
            },
            getBAByPlot(cruise) { //get BA/acre by plot
                var counts = cruise.plots.map(plot => {
                    var trees = plot.trees.filter(tree => {
                        return (tree.field2 !== null && this.includedSpecies.includes(tree.field1));  //exclude empty trees in case new plot created and not updated before user checks stats
                    })
                    return trees.length * cruise.BAF;
                })
                return counts;
            },
            getQMDByPlot(cruise) { //get avg diameter by plot
                let configBAFEntry = this.cruiseStore.state.config.bafArray.values.find(element => element.value === cruise.BAF);
                let PRF = configBAFEntry ? configBAFEntry.PRF : null; // just in case
                let avgDiameterByPlot = cruise.plots.map(plot => {
                    let trees = plot.trees.filter(tree => {
                        return (tree.field2 !== null && this.includedSpecies.includes(tree.field1));  //exclude empty trees in case new plot created and not updated before user checks stats
                    })
                    let treesWithTPA = JSON.parse(JSON.stringify(trees)); //make a working copy so as not to modify tree array elements
                    treesWithTPA.forEach(tree => {
                        let plotRadiusForTree = tree.field2 * PRF;
                        let plotAreaForTree = (plotRadiusForTree ** 2) * Math.PI / 43560;
                        tree.TPA = 1 / plotAreaForTree;
                    })
                    let totalTPAForPlot = treesWithTPA.reduce((sum, tree) => { return sum + tree.TPA }, 0);
                    let totalBAForPlot = cruise.BAF * treesWithTPA.length;
                    let QMD = totalTPAForPlot ? Math.sqrt(totalBAForPlot / (0.005454 * totalTPAForPlot)) : 0; //from Curtis/Marshall, W.Journal Applied Forestry, Why Quadratic Mean Diameter
                    return QMD;
                })
                return avgDiameterByPlot;
            },
            stdDeviation(values, N) {
                function average(data, N) {
                    var sum = data.reduce(function(sum, value) {
                        return sum + value;
                    }, 0);

                    let avg = sum / N;
                    return avg;
                };
                // Function to add zero values for plots with no trees
                function addZeroElements (values, N) {
                    for (let i = values.length; i < N; i++) {
                        values[i] = 0;
                    }
                    return values;
                };
                values = addZeroElements(values, N);
                let avg = average(values, N);
                let squareDiffs = values.map(function(value) {
                    var diff = value - avg;
                    var sqrDiff = diff * diff;
                    return sqrDiff;
                });
                let avgSquareDiff = average(squareDiffs, N);
                let stdDev = Math.sqrt(avgSquareDiff);
                stdDev = stdDev * Math.sqrt(N / (N - 1)); //convert to unbiased stddev J.Rivard
                return stdDev;
            }
        }
    }
</script>

<style scoped lang="scss">
@import '../../variables';
    .stats-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /*min-width: 20vw;*/
        font-size: $opencruise-font-size;
        width: 100%;
        padding-bottom: 15px;
    }
    .stats-item {
        margin-left: 15px;
        margin-right: 15px;
    }
    .stats-container-inline {
        display: inline;
        text-align: center;
    }
    .app-grid-2 {
        grid-template-columns: 0.75fr .75fr;
    }
    .stats-input-container {
        width: 100px;
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-content: center;
        justify-items: center;
        align-items: center;
        column-gap: 10px;
    }
    .stats-input-header {
        grid-column-start: span 2;
        border-bottom: 1px solid black;
        width: 100%;
        text-align: center;
    }
    .stats-label {
        color: rgba(0, 0, 0, 0.541176);
        position: absolute;
        top: 0;
    }
    .stats-radio {
        height:auto;
    }
    .app-select {
        width: 100px;
        margin-bottom: 0;
    }
    .stats-input {
        width: 100px;
        text-align: center;
    }

    @media (max-device-width: 700px) {
        .stats-container {
            font-size: 1.5rem;
        }
    }

</style>
