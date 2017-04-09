<template>
<!--*************  PLOT PAGE  ****************************************-->
<div id="plotPage" class="page" v-if="plot">
    <div class="app-fade" >
        <div class="plot-header">
            <h3 class="plot-item-right" for="plotPlotID">PlotID:</h3>
            <input v-model=plot.plotID class="plot-item-left" type="text" id="plotPlotID">
        </div>
        <div class="app-content plot-content">
            <div class="app-grid" >
                <label id='field1Title' class='app-grid-item' >Sp</label>
                <label id='field2Title' class='app-grid-item' >{{cruise.field2.name}}</label>
                <label id='field3Title' class='app-grid-item' v-if="!cruise.multiProducts">{{cruise.field3.name}}</label>
                <label id='field4Title' class='app-grid-item' v-if="!cruise.multiProducts">{{cruise.field4.name}}</label>
                <label class="app-grid-item app-hide-big-screen" v-if="cruise.multiProducts">&nbsp;</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">G1</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">L1</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">G2</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">L2</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">G3</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">L4</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">G4</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">L4</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">G5</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">L5</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">G6</label>
                <label class="app-grid-item app-hide-small-screen" v-if="cruise.multiProducts">L6</label>
            </div>
            <div v-for="tree in plot.trees">
                <plot-tree v-bind="{multiProducts: cruise.multiProducts, cruiseid: cruiseid, tree: tree}"></plot-tree>
            </div>
        </div>
        <div class="page-footer-fixed app-grid-2">
            <button class="btn--raised" @click="addTree()"><i class="material-icons">add</i><span class="app-button-text"> Tree</span></button>
            <router-link :to="{ name: 'cruise', params: { cruiseid: cruiseid }}">
                <button class="btn--raised" @click="onSavePlot()"><i class="material-icons">save</i><span class="app-button-text"> Save</span></button>
            </router-link>
        </div>
    </div>
</div>
</template>

<script>
import TreeComponent from './tree';
import { Tree } from '../../models/tree';
export default {
    name: 'app-plot',
    inject: ['cruiseStore'],
    components: {'plot-tree': TreeComponent},
    data () {
        return {
            plot: null,
            cruise: null,
            cruiseid: null,
            plotnum: null,
            gradeKey: null
        }
    },
    created () {
        this.cruiseid = parseInt(this.$route.params.cruiseid); //for use in toolbar navigation
        this.plotnum = parseInt(this.$route.params.plotnum);
        this.getPlot();
        this.getPosition().then(position => {
            this.plot.position = position;
        });
    },
    methods: {
        getPlot () {
            if (this.cruiseStore.isOpen) {
                this.gradeKey = this.cruiseStore.state.config.gradeKey;
                this.cruiseStore.getCruise(this.cruiseid).then(cruise => {
                    this.cruise = cruise;
                    let plotIndex = cruise.plots.findIndex(item => item.plotnum === this.plotnum);
                    this.plot = cruise.plots[plotIndex];
                })
                .catch(error => {
                    console.error('Error loading plot data. ' + error);
                });
            } else {
                setTimeout(() => { this.getPlot() }, 500); //store not open, try again later
            }
        },
        onSavePlot() {
            this.plot.trees = this.plot.trees.filter(tree => {  //remove empty trees (DBH = 0)
                return tree.field2 > 0;
            })
            this.cruiseStore.updatePlot(this.cruiseid, this.plot).then(result => {
                let jim = '';
            }).catch(error => {
                console.error('Error updating plot: ' + error);
            });
        },
        addTree() {
            this.cruiseStore.getCruise(this.cruiseid).then(cruise => {
                this.plot.trees.push(new Tree(cruise.defaultSpecies));
            });
        },
        getPosition() {
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
    }
}
</script>

<style scoped>
.app-content {
    padding-top: 0px;
}
.plot-header {
    display: flex;
    justify-content: center;
    align-items: center;
}
.plot-content {
    margin-top: 0px;
}
.plot-item-right {
    margin-right: 10px;
}
.plot-item-left {
    text-align: center;
    background-color: white;
    margin-bottom: 0;
    padding: 0;
    border-bottom: none;
}
h3 {
    padding-top: 0px;
}
</style>
