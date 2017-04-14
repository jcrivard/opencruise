<template>
<!--*************  CRUISE CONTENT  ************************************-->
    <div id="cruisePage" class="page" v-if="cruise">
        <cruise-menu v-bind:cruise="cruise" v-on:actionEvent="onActionEvent($event)" ></cruise-menu>
        <div class="app-fade">
            <h3 >Cruise Info</h3>
            <div id="cruisePageContent" class="app-content">
                <div class="app-grid-1" id="cruiseDetail">
                    <div class="app-grid-item-input">
                        <input class="app-select" v-model="cruise.date" v-on:change="updateCruise({date: $event.target.value})" size="15" type="date" id="cruiseDate"/>
                        <label class="app-select-label">Date</label>
                    </div>
                    <div class="app-grid-item-input">
                        <input required  v-model="cruise.people" v-on:change="updateCruise({people: $event.target.value})" size="15" type="text" ref="foresterName" id="foresterName"/>
                        <label class="app-input-label">Forester Name</label>
                    </div>
                    <div class="app-grid-item-input">
                        <input  v-model="cruise.cruiseName" v-on:change="updateCruise({cruiseName: $event.target.value})" size="15" type="text" ref="projectName" id="projectName"/>
                        <label class="app-input-label">Project Name</label>
                    </div>
                    <div class="app-grid-item-input">
                        <label class="app-select-label" for="defaultSpecies">Default Species</label>
                        <select class="app-select" v-model="cruise.defaultSpecies" v-on:change="updateCruise({defaultSpecies: $event.target.value})" ref='defaultSpecies' id='defaultSpecies'>
                            <option v-for="species in speciesKey.species" :key="species.key" v-bind:value="species.key">
                                {{species.key}}
                            </option>
                        </select>
                    </div>

                    <cruise-baf v-bind:inputBAF="cruise.BAF" v-on:updateCruiseEvent="updateCruise($event)"></cruise-baf>
                    <div class="cruise-switch">
                        <span>Segments</span>
                        <input class="toggle" type="checkbox" id="segments" v-model="cruise.multiProducts" v-on:change="updateCruise({multiProducts: $event.target.checked})"/>
                        <label for="segments"></label>
                    </div>
                </div>
            </div>
        </div>
        <app-dialog v-if="cruise" v-bind="{showDialog: showPlotlistDialog}" @closeDialog="togglePlotlistDialog">
            <h2 slot="header" >Select Plot</h2>
            <cruise-plotlist slot="content" v-if="cruise" v-bind="{cruise: cruise}" ></cruise-plotlist>
        </app-dialog>
        <app-dialog v-if="cruise" v-bind="{showDialog: showFieldsDialog}" @closeDialog="toggleFieldsDialog">
            <h2 slot="header" >Fields</h2>
            <cruise-fields slot="content" v-if="cruise" v-bind="{cruise: cruise}" @updateFields="updateFields"></cruise-fields>
        </app-dialog>
        <app-dialog v-if="cruise" v-bind="{showDialog: showStatsDialog}" @closeDialog="toggleStatsDialog">
            <h2 slot="header" >Statistics</h2>
            <cruise-stats slot="content" v-if="cruise" v-bind="{cruise: cruise, allSpecies: speciesKey.species}" @closeDialog="toggleStatsDialog"></cruise-stats>
        </app-dialog>
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
            showDialog: false
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
                    this.togglePlotlistDialog();
                    break;
                case 'fields':
                    this.toggleFieldsDialog();
                    break;
                case 'stats':
                    this.toggleStatsDialog();
                    break;
                case 'test':
                    this.toggleTestDialog();
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
            this.showPlotlistDialog = !this.showPlotlistDialog;
        },
        toggleFieldsDialog() {
             //this.showFieldsDialog = !this.showFieldsDialog;
             this.showFieldsDialog = !this.showFieldsDialog;
        },
        toggleStatsDialog() {
             this.showStatsDialog = !this.showStatsDialog;
        },
        toggleTestDialog() {
             this.showDialog = !this.showDialog;
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
.cruise-switch {
    margin-top: 15px;
    display: flex;
}
.app-grid-item {
    margin-right: 30px;
}
.app-grid-item-input {
    text-align: initial;
    max-width: 50%;
}
@media (max-device-width: 500px) {
    .app-grid-item-input {
        max-width: 70%;
    }
}
</style>
