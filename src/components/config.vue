<template>
    <div id="configPage" class="page page-will-change">
        <div class="fade-in-out" >
            <h3>Defaults</h3>
            <div class="content-main gridContainer" v-if="cruiseParms">
                <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                    <div class="mdl-tabs__tab-bar">
                        <a href="#cruise-panel" class="mdl-tabs__tab is-active" @click="updateTabs('cruise-panel')"><md-icon>dashboard</md-icon>Cruise</a>
                        <a href="#species-panel" class="mdl-tabs__tab" @click="updateTabs('species-panel')"><md-icon>nature</md-icon>Species</a>
                        <a href="#grades-panel" class="mdl-tabs__tab" @click="updateTabs('grades-panel')"><md-icon>format_list_numbered</md-icon>Grades</a>
                        <a href="#baf-panel" class="mdl-tabs__tab" @click="updateTabs('baf-panel')"><md-icon style="left:30%;">tablet</md-icon>BAF</a>
                    </div>
                    <!--**************  CRUISE TAB ***************** -->
                    <div class="mdl-tabs__panel fade-in-out is-active" id="cruise-panel" ref="cruise-panel">
                        <div class="gridContainer1 config-margin">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-input-fixed">
                                <input class="mdl-textfield__input" type='text' v-model="cruiseParms.cruiseName" @change="updateConfig()" />
                                <label class="mdl-textfield__label">Project Name</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-input-fixed">
                                <input class="mdl-textfield__input" type='text' v-model="cruiseParms.people" @change="updateConfig()"/>
                                <label class="mdl-textfield__label">Forester Name</label>
                            </div>
                            <div class="mdlext-selectfield mdlext-js-selectfield mdlext-selectfield--floating-label config-input-fixed">
                                <label>Default Species</label>
                                <select class="mdlext-selectfield__select" v-model="cruiseParms.defaultSpecies" @change="updateConfig()">
                                    <option v-for="species in speciesKey.species" v-bind:value="species.key">
                                        {{species.key}}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <h4>Data Fields</h4>
                        <div class="gridContainer3Equal">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-field-center config-input-fixed">
                                <input class="mdl-textfield__input" type='text' v-model="cruiseParms.field2.name" @change="updateConfig($event.target.value)" />
                                <label class="mdl-textfield__label">Name</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-field-center config-input-fixed">
                                <input class="mdl-textfield__input" type='number' v-model="cruiseParms.field2.min" @change="updateConfig($event.target.value)" />
                                <label class="mdl-textfield__label">Min</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-field-center config-input-fixed">
                                <input class="mdl-textfield__input" type='number' v-model="cruiseParms.field2.max" @change="updateConfig($event.target.value)" />
                                <label class="mdl-textfield__label">Max</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-field-center config-input-fixed">
                                <input class="mdl-textfield__input" type='text'  v-model="cruiseParms.field3.name" @change="updateConfig($event.target.value)" />
                                <label class="mdl-textfield__label">Name</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-field-center config-input-fixed">
                                <input class="mdl-textfield__input" type='number' v-model="cruiseParms.field3.min" @change="updateConfig($event.target.value)" />
                                <label class="mdl-textfield__label">Min</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-field-center config-input-fixed">
                                <input class="mdl-textfield__input" type='number' v-model="cruiseParms.field3.max" @change="updateConfig($event.target.value)" />
                                <label class="mdl-textfield__label">Max</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-field-center config-input-fixed">
                                <input class="mdl-textfield__input" type='text' v-model="cruiseParms.field4.name" @change="updateConfig($event.target.value)" />
                                <label class="mdl-textfield__label">Name</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-field-center config-input-fixed">
                                <input class="mdl-textfield__input"  type='number' v-model="cruiseParms.field4.min" @change="updateConfig($event.target.value)" />
                                <label class="mdl-textfield__label">Min</label>
                            </div>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-field-center config-input-fixed">
                                <input class="mdl-textfield__input"  type='number' v-model="cruiseParms.field4.max" @change="updateConfig($event.target.value)" />
                                <label class="mdl-textfield__label">Max</label>
                            </div>
                        </div>
                        <div class="gridContainer1">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label gridItem config-input-fixed">
                                <label class="mdl-textfield__label">Min {{cruiseParms.field2.name}} for {{cruiseParms.field3.name}}:</label>
                                <input class="mdl-textfield__input" type='number' v-model="cruiseParms.field3.field2Min" @change="updateConfig($event.target.value)" />
                            </div>
                        </div>

                    </div>
                    <!--**************  SPECIES TAB ***************** -->
                    <div class="mdl-tabs__panel fade-in-out" id="species-panel" ref="species-panel">
                        <div class="gridContainer5 config-margin">
                            <md-button class="md-raised" @click="addSpecies()"><md-icon>add</md-icon><span class="btn-text"> Add</span></md-button>
                            <label class="gridItem">Species</label>
                            <label class="gridItem">Voice</label>
                            <label class="gridItem">Voice</label>
                            <label class="gridItem">Voice</label>
                            <template v-for="species in speciesKey.species" class="gridContainer5 config-margin" >
                                <md-button class="md-raised"  @click= "deleteSpecies(species)"><md-icon>delete</md-icon><span class="btn-text"> Delete</span></md-button>
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
                            </template>
                        </div>
                    </div>
                    <!--**************  GRADES TAB ***************** -->
                    <div class="mdl-tabs__panel fade-in-out" id="grades-panel" ref="grades-panel" v-if="gradeKey">
                        <div class="gridContainer2 config-margin">
                           <md-button class="md-raised" @click="addGrade()"><md-icon>add</md-icon><span class="btn-text"> Add</span></md-button>
                            <label class='gridItem'>Grade</label>
                        </div>
                        <div v-for="grade in gradeKey.grades" class="gridContainer2" >
                           <md-button class="md-raised"  @click="deleteGrade(grade)"><md-icon>delete</md-icon><span class="btn-text"> Delete</span></md-button>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-inputs">
                                <input class="mdl-textfield__input gridItemLeft gridInputItem" type='text' v-model="grade.name" @change="updateConfig()" />
                                <label class="mdl-textfield__label"></label>
                            </div>
                        </div>
                    </div>
                    <!--**************  BAF TAB ***************** -->
                    <div class="mdl-tabs__panel fade-in-out" id="baf-panel" ref="baf-panel" v-if="bafArray">
                        <div class="gridContainer2 config-margin">
                           <md-button class="md-raised" @click="addBAF()"><md-icon>add</md-icon><span class="btn-text"> Add</span></md-button>
                            <label class='gridItem'>BAF</label>
                        </div>
                        <div v-for="bafVal in bafArray.values" class="gridContainer2" >
                           <md-button class="md-raised"  @click="deleteBAF(bafVal)"><md-icon>delete</md-icon><span class="btn-text"> Delete</span></md-button>
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label config-inputs">
                                <input class="mdl-textfield__input gridItemLeft gridInputItem" type='text' v-model="bafVal.value"  @change="updateConfig()" />
                                <label class="mdl-textfield__label"></label>
                            </div>
                        </div>
                    </div>
                </div>
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

<style scoped>
    input {
        width: 100%;
    }
    label[class*="gridItem"] {
        font-weight: bold;
    }
    a > i {
        position: absolute;
        top:0;
        left: 35%;
    }
    .config-input-fixed {
        width: 30%;
    }
    .config-field-center {
        text-align-last:center;
        text-align:center;
    }
    .gridContainer2 {
        justify-content: center;
        grid-template-columns: .15fr .25fr;
    }
    .gridContainer5 {
        justify-items: center;
        padding-left: 5px;

    }
    .gridContainer5::first-line {
        border-bottom: 1px solid #ddd;
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
    .mdl-tabs__tab {
        padding-right: 12px;
        padding-left: 12px;
        line-height: 65px;
    }
    .mdl-button {
        padding: 0px 8px;
        min-width: 30px;
    }
    .btn-text {
        font-size: 1.5rem;
    }
    @media (max-device-width: 500px) {
        .config-input-fixed {
            width: 80%;
        }
        .gridContainer2 {
            grid-template-columns: .25fr .35fr;
        }
    }
</style>
