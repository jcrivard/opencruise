<template>
    <div>
        <div class="stats-container" style="flex-direction:row">
            <span class="stats-Item">Total Plots:  {{stats.totalPlots}}</span>
            <span class="stats-Item">Total Trees:  {{stats.totalTrees}}</span>
            <span class="stats-Item">Avg BA/Acre: {{stats.avgBA}}</span>
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
                    <input class="stats-input" required v-bind:id="'Interval' + itemNum" type="number" v-model="val.CI" v-on:change="computeStats()"/>
                    <label class="app-input-label" v-bind:for="'Interval' + itemNum">Interval {{itemNum + 1}}</label>
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
                    <div>+/- {{cv.CI}}% BA at {{cv.CL}}%</div>
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
                confidenceVals: [{CI: 10, CL: 95, plotsRequired: null}, {CI: 20, CL: 95, plotsRequired: null}], //default CIs; need to setup config option,
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
        },
        mounted() {
            //window.dialogPolyfill.registerDialog(this.$refs.statsRef); //polyfill for html dialog element
        },
        methods: {
            closeDialog() {
                this.$refs.statsRef.close();
            },
            sendCloseStatsEvent() {
                this.$emit('closeStats');  //to be consistent, we let parent close dialog by toggling showPlotList
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
                }
                let treeCountsArray = this.getTreeCounts(this.cruise);
                this.stats = this.processTreeCounts(treeCountsArray, this.cruise, this.confidenceVals);
            },
            numPlotsRequired(CI, CL, numTreesByPlot, numPlots, numTrees, BAF) {
                var tObj = this.validCLs.find(item => { //should only be one result returned
                    return item.CL === CL;
                });
                var t = tObj.T;  //get t value
                var stdDev = this.stdDeviation(numTreesByPlot, numPlots) * BAF;  //get stddev in expressed as BA/acre
                var meanBA = (numTrees * BAF) / numPlots; //mean BA/acre
                var CV = (stdDev / meanBA) * 100; //coeffecient of variation in percent
                var A = CI; //in percent (ie. 10 and not .1)
                var requiredPlots = Math.pow(((t * CV) / A), 2);
                return Math.round(requiredPlots);
            },
            processTreeCounts(counts, cruise, confidenceArray) {
                var total = 0;
                var totalArray = [];
                for (var i = 0; i < counts.length; i++) {
                    total = total + counts[i];
                    totalArray[i] = counts[i];
                }
                let numTreesByPlot = totalArray;
                var stats = new Stats();
                stats.totalTrees = total;
                stats.totalPlots = cruise.plots.length;
                stats.avgBA = Math.round((stats.totalTrees * cruise.BAF) / stats.totalPlots);
                let results = confidenceArray.map(item => {
                    let plotsRequired = (this.numPlotsRequired(item.CI, item.CL, numTreesByPlot, stats.totalPlots, stats.totalTrees, cruise.BAF));
                    stats.confidenceValues.push({CI: item.CI, CL: item.CL, plotsRequired: plotsRequired});
                });
                return stats;
            },
            getTreeCounts(cruise) { //get tree count by plot
                var counts = cruise.plots.map(plot => {
                    var trees = plot.trees.filter(tree => {
                        return (tree.field2 !== null && this.includedSpecies.includes(tree.field1));  //exclude empty trees in case new plot created and not updated before user checks stats
                    })
                    return trees.length;
                })
                return counts;
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
    .stats-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /*min-width: 20vw;*/
        font-size: 2.0rem;
        width: 100%;
        padding-bottom: 15px;
    }
    .stats-Item {
        margin-left: 15px;
        margin-right: 15px;
    }
    .app-grid-2 {
        grid-template-columns: 0.75fr .75fr;
    }
    .stats-input-container {
        width: 100px;
        position: relative;
    }
    .stats-label {
        color: rgba(0, 0, 0, 0.541176);
        position: absolute;
        top: 0;
    }
    .app-select, .stats-input {
        width: 100px;
    }
    .app-select {
        margin-bottom: 0;
    }

    @media (max-device-width: 700px) {
        .stats-summary {
            font-size: 1.8rem; /*need a little more room*/
        }
        .stats-container {
            font-size: 1.5rem;
        }
    }

</style>
