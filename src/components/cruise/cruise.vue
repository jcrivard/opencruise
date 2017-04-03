<template>
<!--*************  CRUISE CONTENT  ************************************-->
    <div id="cruisePage" class="page" v-if="cruise">
        <cruise-menu v-bind:cruise="cruise" v-on:actionEvent="onActionEvent($event)" ></cruise-menu>
        <div class="fade-in-out">
            <h3 >Cruise Info</h3>
            <div id="cruisePageContent" class="content-main">
                <div class="gridContainer1" id="cruiseDetail">
                    <md-input-container class="gridInputItem">
                        <md-input v-model="cruise.date" v-on:change="updateCruise({date: $event.target.value})" size="15" type="date" id="cruiseDate"></md-input>
                        <label>Date</label>
                    </md-input-container>
                    <md-input-container class="gridInputItem">
                        <md-input v-model="cruise.people" v-on:change="updateCruise({people: $event.target.value})" size="15" type="text" ref="foresterName" id="foresterName"></md-input>
                        <label >Forester Name</label>
                    </md-input-container>
                    <md-input-container class="gridInputItem">
                        <md-input  v-model="cruise.cruiseName" v-on:change="updateCruise({cruiseName: $event.target.value})" size="15" type="text" ref="projectName" id="projectName"></md-input>
                        <label>Project Name</label>
                    </md-input-container>
                    <md-input-container class="gridInputItem">
                        <label for="defaultSpecies">Default Species</label>
                        <md-select v-model="cruise.defaultSpecies" v-on:change="updateCruise({defaultSpecies: $event})" ref='defaultSpecies' id='defaultSpecies'>
                            <md-option v-for="species in speciesKey.species" :key="species.key" v-bind:value="species.key">
                                {{species.key}}
                            </md-option>
                        </md-select>
                    </md-input-container>

                    <cruise-baf v-bind:inputBAF="cruise.BAF" v-on:updateCruiseEvent="updateCruise($event)"></cruise-baf>
                    <div class="cr-segments">
                        <span class="gridItem mdl-switch__label">Segments</span>
                        <label class="gridItem mdl-switch mdl-js-switch mdl-js-ripple-effect" for="segments">
                            <input class="mdl-switch__input" type=checkbox id="segments" v-model="cruise.multiProducts" v-on:change="updateCruise({multiProducts: $event.target.checked})"/>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <cruise-plotlist v-if="cruise" v-bind="{cruise: cruise, showPlotlist: showPlotlistDialog}" v-on:closePlotList="this.togglePlotlistDialog"></cruise-plotlist>
        <cruise-fields v-if="cruise" v-bind="{cruise: cruise, showFields: showFieldsDialog}" @updateFields="updateFields" @closeFields="toggleFieldsDialog()"></cruise-fields>
        <cruise-stats v-if="cruise" v-bind="{cruise: cruise, showStats: showStatsDialog, allSpecies: speciesKey.species}" @closeStats="toggleStatsDialog()"></cruise-stats>
    </div>
</template>

<script>

import CruiseBAF from './baf'
import CruiseMenu from './cruisemenu'
import PlotList from './plotlist'
import Fields from './fields'
import Stats from './stats'
import { CruiseService } from '../../services/cruiseservice'

export default {
    name: 'app-cruise',
    inject: ['cruiseStore'],
    data () {
        return {
            cruise: null,
            speciesKey: null,
            cruiseid: null,
            showPlotlistDialog: false,
            showFieldsDialog: false,
            showStatsDialog: false,
            mdlNodeList: null   // need to downgrade mdl nodes before destroy to prevent memory leaks
        }
    },
    components: {
        'cruise-menu': CruiseMenu,
        'cruise-baf': CruiseBAF,
        'cruise-plotlist': PlotList,
        'cruise-fields': Fields,
        'cruise-stats': Stats
    },
    created () {
        this.cruiseid = parseInt(this.$route.params.cruiseid);
        this.getCruiseFromStore();
    },
    updated () {
        this.mdlNodeList = document.getElementById('cruiseDetail');
        //window.componentHandler.upgradeDom();
    },
    methods: {
        getCruiseFromStore() {
            if (this.cruiseStore.isOpen) {
                this.speciesKey = this.cruiseStore.state.config.speciesKey;
                this.cruiseStore.getCruise(this.cruiseid).then(result => {
                    //Object.assign(this.cruise, result);
                    this.cruise = result;
                }).catch(error => {
                    console.log('Error getting cruise for cruiseid: ' + this.cruiseid + ', Error:' + error);
                });
            } else {
                setTimeout(() => { this.getCruiseFromStore() }, 500); //store not open, try again later
            }
        },
        onActionEvent(event) {
            switch (event) {
                case 'plotlist':
                    this.showPlotlistDialog = true;
                    break;
                case 'fields':
                    this.showFieldsDialog = true;
                    break;
                case 'stats':
                    this.showStatsDialog = true;
                    break;
                case 'download':
                    CruiseService.downloadFile(this.cruise);
                    var jim = '';
                    break;
            }
        },
        updateCruise(propObj) {
            let updateObj = {cruiseid: this.cruiseid};
            Object.assign(updateObj, propObj); //copy properties
            this.cruiseStore.updateCruise(updateObj).then(result => {
                let jim = '';
            }).catch(error => {
                console.error('Error updating cruise database: ' + error);
            });
        },
        updateFields(fieldsArray) {
            let propObj = {
                field2: fieldsArray[0],
                field3: fieldsArray[1],
                field4: fieldsArray[2]
            };
            this.updateCruise(propObj);
        },
        togglePlotlistDialog() {
            this.showPlotlistDialog = false;
        },
        toggleFieldsDialog() {
             this.showFieldsDialog = false;
        },
        toggleStatsDialog() {
             this.showStatsDialog = false;
        }
    }
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
}
.md-option {
    font-size: 2.0rem;
}
.select-margin {
    margin-top: 15px;
}
.mdl-textfield, .mdlext-selectfield {
    min-width:200px;
    width: initial;
}
.mdlext-selectfield--floating-label > label {
    font-size: 12px;
    color: #3f51b5;
}
.mdlext-selectfield {
    padding: 0px 0px 20px 0px;
}
.cr-segments {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 15px;
}
.gridItem {
    margin-right: 30px;
}
</style>
