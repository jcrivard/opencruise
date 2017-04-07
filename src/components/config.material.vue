<template>
    <div id="configPage" class="page page-will-change">
        <app-toolbar></app-toolbar>
        <div class="fade-in-out" >
            <h3>Defaults</h3>
            <div class="content-main gridContainer" v-if="cruiseParms">
                <md-tabs md-centered>
                    <!--**************  CRUISE TAB ***************** -->
                    <md-tab md-label="Cruise" md-icon="dashboard" class="gridContainer1">
                        <md-input-container class="config-input-fixed">
                            <label>Project Name</label>
                            <md-input type='text' v-model="cruiseParms.cruiseName" @change="updateConfig()" /></md-input>
                        </md-input-container>
                        <md-input-container class="config-input-fixed">
                            <label>Forester Name</label>
                            <md-input type='text' v-model="cruiseParms.people" @change="updateConfig()"/></md-input>
                        </md-input-container>
                        <md-input-container class="config-input-fixed">
                            <label>Default Species</label>
                            <md-select  v-model="cruiseParms.defaultSpecies" @change="updateConfig()">
                                <md-option v-for="species in speciesKey.species" v-bind:key="species.key"v-bind:value="species.key">
                                    {{species.key}}
                                </md-option>
                            </md-select>
                        </md-input-container>

                        <h4>Data Fields</h4>
                        <div class="gridContainer3Equal">
                            <md-input-container class="config-field-center">
                                <md-input type='text' v-model="cruiseParms.field2.name" @change="updateConfig($event.target.value)" /></md-input>
                                <label>Name</label>
                            </md-input-container>
                             <md-input-container class="config-field-center">
                                <md-input type='number' v-model="cruiseParms.field2.min" @change="updateConfig($event.target.value)" /></md-input>
                                <label >Min</label>
                            </md-input-container>
                             <md-input-container class="config-field-center">
                                <md-input type='number' v-model="cruiseParms.field2.max" @change="updateConfig($event.target.value)" /></md-input>
                                <label >Max</label>
                            </md-input-container>
                             <md-input-container class="config-field-center">
                                <md-input type='text'  v-model="cruiseParms.field3.name" @change="updateConfig($event.target.value)" /></md-input>
                                <label >Name</label>
                            </md-input-container>
                             <md-input-container class="config-field-center">
                                <md-input type='number' v-model="cruiseParms.field3.min" @change="updateConfig($event.target.value)" /></md-input>
                                <label >Min</label>
                            </md-input-container>
                             <md-input-container class="config-field-center">
                                <md-input type='number' v-model="cruiseParms.field3.max" @change="updateConfig($event.target.value)" /></md-input>
                                <label >Max</label>
                            </md-input-container>
                             <md-input-container class="config-field-center">
                                <md-input type='text' v-model="cruiseParms.field4.name" @change="updateConfig($event.target.value)" /></md-input>
                                <label >Name</label>
                            </md-input-container>
                             <md-input-container class="config-field-center">
                                <md-input  type='number' v-model="cruiseParms.field4.min" @change="updateConfig($event.target.value)" /></md-input>
                                <label >Min</label>
                            </md-input-container>
                             <md-input-container class="config-field-center">
                                <md-input  type='number' v-model="cruiseParms.field4.max" @change="updateConfig($event.target.value)" /></md-input>
                                <label >Max</label>
                            </md-input-container>
                        </div>
                        <div class="gridContainer1">
                            <md-input-container class="gridItem config-field-center">
                                <label >Min {{cruiseParms.field2.name}} for {{cruiseParms.field3.name}}:</label>
                                <md-input type='number' v-model="cruiseParms.field3.field2Min" @change="updateConfig($event.target.value)" /></md-input>
                            </md-input-container>
                        </div>
                    </md-tab>
                    <!--**************  SPECIES TAB ***************** -->
                     <md-tab md-label="Species" md-icon="nature">
                        <div class="gridContainer5 config-margin">
                            <md-button class="md-raised" @click="addSpecies()"><i class="material-icons">add</i><span class="app-button-text"> Add</span></md-button>
                            <label class="gridItem">Species</label>
                            <label class="gridItem">Voice</label>
                            <label class="gridItem">Voice</label>
                            <label class="gridItem">Voice</label>
                        </div>
                        <div v-for="species in speciesKey.species" class="gridContainer5 config-margin" >
                            <md-button class="md-raised"  @click= "deleteSpecies(species)"><i class="material-icons">delete</i><span class="app-button-text"> Delete</span></md-button>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-inputs">
                                <input class="mdl-textfield__input gridInputItem" type='text' v-model="species.key" @change="updateConfig($event.target.value)"  />
                                <label class="mdl-textfield__label"></label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-inputs">
                                <input class="mdl-textfield__input gridInputItem" type='text' v-model="species.names[0]" @change="updateConfig($event.target.value)"  />
                                <label class="mdl-textfield__label"></label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-inputs">
                                <input class="mdl-textfield__input gridInputItem" type='text' v-model="species.names[1]" @change="updateConfig($event.target.value)"  />
                                <label class="mdl-textfield__label"></label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-inputs">
                                <input class="mdl-textfield__input gridInputItem" type='text' v-model="species.names[2]" @change="updateConfig($event.target.value)" />
                                <label class="mdl-textfield__label"></label>
                            </div>
                        </div>

                     </md-tab>
                    <!--**************  GRADES TAB ***************** -->
                    <md-tab md-label="Grades" md-icon="format_list_numbered">
                        <div class="gridContainer2 config-margin">
                           <md-button class="md-raised" @click="addGrade()"><i class="material-icons">add</i><span class="app-button-text"> Add</span></md-button>
                            <label class='gridItem'>Grade</label>
                        </div>
                        <div v-for="grade in gradeKey.grades" class="gridContainer2" >
                           <md-button class="md-raised"  @click="deleteGrade(grade)"><i class="material-icons">delete</i><span class="app-button-text"> Delete</span></md-button>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-inputs">
                                <input class="mdl-textfield__input gridItemLeft gridInputItem" type='text' v-model="grade.name" @change="updateConfig()" />
                                <label class="mdl-textfield__label"></label>
                            </div>
                        </div>
                    </md-tab>
                    <!--**************  BAF TAB ***************** -->
                    <md-tab md-label="BAF" md-icon="crop_5_4">
                        <div class="gridContainer2 config-margin">
                           <md-button class="md-raised" @click="addBAF()"><i class="material-icons">add</i><span class="app-button-text"> Add</span></md-button>
                            <label class='gridItem'>BAF</label>
                        </div>
                        <div v-for="bafVal in bafArray.values" class="gridContainer2" >
                           <md-button class="md-raised"  @click="deleteBAF(bafVal)"><i class="material-icons">delete</i><span class="app-button-text"> Delete</span></md-button>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-inputs">
                                <input class="mdl-textfield__input gridItemLeft gridInputItem" type='text' v-model="bafVal.value"  @change="updateConfig()" />
                                <label class="mdl-textfield__label"></label>
                            </div>
                        </div>
                    </md-tab>
                </md-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import { Grade, Species, BAF } from '../models/config';
export default {
    name: 'config',
    inject: ['cruiseStore'],
    data () {
        return {
            speciesKey: null,
            gradeKey: null,
            cruiseParms: null,
            bafArray: null
        }
    },
    created () {
        this.loadConfig();
    },
    mounted () {
        //window.componentHandler.upgradeDom(); //for mdl lite
    },
    updated () {
        //window.componentHandler.upgradeDom(); //for mdl lite
    },
    methods: {
        updateTabs (target) {  //workaround for vue not rerendering after is-active class removed
            for (let ref in this.$refs) {
                let jim = ref;
            }
        },
        loadConfig () {
            if (this.cruiseStore.isOpen) {
                this.speciesKey = this.cruiseStore.state.config.speciesKey;
                this.gradeKey = this.cruiseStore.state.config.gradeKey;
                this.cruiseParms = this.cruiseStore.state.config.cruiseParms;
                this.bafArray = this.cruiseStore.state.config.bafArray;
            } else {
                setTimeout(() => { this.loadConfig() }, 500); //store not open, try again later
            }
        },
        updateConfig() {
            let updateObj = {
                configid: 'A',
                cruiseParms: this.cruiseParms,
                speciesKey: this.speciesKey,
                gradeKey: this.gradeKey,
                bafArray: this.bafArray
            };
            this.cruiseStore.updateConfig(updateObj).then(result => {
                console.log('Configuration update successful');
            }, err => {
                console.error('Configuration update successful');
            });
        },
        addSpecies() {
            this.speciesKey.species.unshift(new Species());
        },
        addGrade() {
            this.gradeKey.grades.unshift(new Grade());
        },
        addBAF() {
            this.bafArray.values.unshift(new BAF());
        },
        deleteSpecies(species) {
            let index = this.speciesKey.species.indexOf(species);
            this.speciesKey.species.splice(index, 1);
            this.updateConfig();
        },
        deleteGrade(grade) {
            let index = this.gradeKey.grades.indexOf(grade);
            this.gradeKey.grades.splice(index, 1);
            this.updateConfig();
        },
        deleteBAF(bafVal) {
            let index = this.bafArray.values.indexOf(bafVal);
            this.bafArray.values.splice(index, 1);
            this.updateConfig();
        }
    }
}
</script>

<style >
    input {
        width: 100%;
    }
    .md-input-container.md-input-focused::after {
        background-color: #3f51b5 !important;
    }
    label, label:focus {
        color: #3f51b5 !important;
        left: inherit !important;
    }
    .config-input-fixed {
        width: 30% !important;
    }
    .config-field-center {
        text-align-last:center;
        text-align:center;
        justify-content: center;
    }
    .content-main {
        padding-top:0;
    }
    .gridContainer2 {
        justify-content: center;
        grid-template-columns: .15fr .25fr;
    }
    .gridContainer5 {
        justify-items: start;
        padding-left: 5px;

    }
    .gridContainer1 {
        justify-content: center;
    }
    .config-margin {
        margin-top: 15px;
        margin-bottom: 5px;
    }
    .config-inputs {
        padding: 5px 0px;
    }
    .config-inputs > .mdl-textfield__label:after {
        bottom: 5px;
    }
    .md-tab-header {
        border-bottom: 1px solid #ddd !important;
    }
    .md-tab-indicator {
        background-color: #f0e009 !important;
    }
    .mdl-tabs__tab {
        padding-right: 12px;
        padding-left: 12px;
    }
    .mdl-button {
        padding: 0px 8px;
        min-width: 30px;
    }
    .app-button-text {
        font-size: 1.5rem;
    }
    @media (max-device-width: 500px) {
        .config-input-fixed {
            width: 80% !important;
        }
        .gridContainer2 {
            grid-template-columns: .25fr .35fr;
        }
    }
</style>
