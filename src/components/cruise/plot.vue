<template>
<!--*************  PLOT PAGE  ****************************************-->
<div id="plotPage" class="page" v-if="plot">
    <div class="fade-in-out" >
        <div class="gridContainer3 gridContainer-split">
            <h3 class="gridItemRight" for="plotPlotID">PlotID:</h3>
            <input v-model=plot.plotID class="gridItem gridItemLeft" type="text" id="plotPlotID">
        </div>
        <div class="content-main plot-content">
            <div class="gridContainer" >
                <label id='field1Title' class='gridItem' >Sp</label>
                <label id='field2Title' class='gridItem' >{{cruise.field2.name}}</label>
                <label id='field3Title' class='gridItem' v-if="!cruise.multiProducts">{{cruise.field3.name}}</label>
                <label id='field4Title' class='gridItem' v-if="!cruise.multiProducts">{{cruise.field4.name}}</label>
                <label class="gridItem bigScreenHide" v-if="cruise.multiProducts">&nbsp;</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">G1</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">L1</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">G2</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">L2</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">G3</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">L4</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">G4</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">L4</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">G5</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">L5</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">G6</label>
                <label class="gridItem smallScreenHide" v-if="cruise.multiProducts">L6</label>
            </div>
            <div v-for="tree in plot.trees">
                <plot-tree v-bind="{multiProducts: cruise.multiProducts, cruiseid: cruiseid, tree: tree}"></plot-tree>
            </div>
        </div>
        <div class="page-footer-fixed gridContainer2">
            <md-button class="md-raised" @click.native="addTree()"><md-icon>add</md-icon><span class="btn-text"> Tree</span></md-button>
            <router-link :to="{ name: 'cruise', params: { cruiseid: cruiseid }}">
                <md-button class="md-raised" @click.native="onSavePlot()"><md-icon>save</md-icon><span class="btn-text"> Save</span></md-button>
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
    },
    updated() {
        //window.componentHandler.upgradeDom(); //for mdl lite
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
        }
    }
}
</script>

<style scoped>
.content-main {
    padding-top: 0px;
}
.plot-microphone {
    font-size: 3rem;
    color: black;
}
.plot-content {
    margin-top: 0px;
}
h3 {
    padding-top: 0px;
}
</style>
