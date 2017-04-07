<template>
    <div id="configPage" class="page page-will-change">
        <div class="fade-in-out" >
            <h3>Defaults</h3>
            <div class="content-main" v-if="cruiseParms">
                <div class="config-header">
                    <div class="gridItem config-header-item">
                        <input type="radio" name="tabs" id="cruise-tab" value="cruise" v-model="activeTab">
                        <label for="cruise-tab">Cruise</label>
                    </div>
                    <div class="gridItem config-header-item">
                        <input type="radio" name="tabs" id="species-tab" value="species" v-model="activeTab">
                        <label for="species-tab">Species</label>
                    </div>
                    <div class="gridItem config-header-item">
                        <input type="radio" name="tabs" id="grades-tab" value="grades" v-model="activeTab">
                        <label for="grades-tab">Grades</label>
                    </div>
                    <div class="gridItem config-header-item">
                        <input type="radio" name="tabs" id="baf-tab" value="baf" v-model="activeTab">
                        <label for="baf-tab">BAF</label>
                    </div>
                </div>
                <div class="config-content">
                    <!--**************  CRUISE TAB ***************** -->
                    <transition name="fade">
                            <div class="tab-content" id="cruise-panel" ref="cruise-panel" v-if="activeTab=='cruise'">
                                <div class="gridContainer1 config-margin">
                                    <div class="config-input-fixed">
                                        <input required type='text' v-model="cruiseParms.cruiseName" @change="updateConfig()" />
                                        <label class="app-input-label">Project Name</label>
                                    </div>
                                    <div class="config-input-fixed">
                                        <input required type='text' id="config-people" v-model="cruiseParms.people" @change="updateConfig()"/>
                                        <label class="app-input-label" for="config-people">Forester Name</label>
                                    </div>
                                    <div class="config-input-fixed">
                                        <label class="app-select-label" for="config-defSpecies">Default Species</label>
                                        <select class="app-select" id="config-defSpecies" v-model="cruiseParms.defaultSpecies" @change="updateConfig()">
                                            <option v-for="species in speciesKey.species" v-bind:value="species.key">
                                                {{species.key}}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <h4>Data Fields</h4>
                                <div class="gridContainer3Equal">
                                    <div class="config-field-center config-input-fixed">
                                        <input required type='text' v-model="cruiseParms.field2.name" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Name</label>
                                    </div>
                                    <div class="config-field-center config-input-fixed">
                                        <input required type='number' v-model="cruiseParms.field2.min" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Min</label>
                                    </div>
                                    <div class="config-field-center config-input-fixed">
                                        <input required type='number' v-model="cruiseParms.field2.max" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Max</label>
                                    </div>
                                    <div class="config-field-center config-input-fixed">
                                        <input required type='text'  v-model="cruiseParms.field3.name" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Name</label>
                                    </div>
                                    <div class="config-field-center config-input-fixed">
                                        <input required type='number' v-model="cruiseParms.field3.min" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Min</label>
                                    </div>
                                    <div class="config-field-center config-input-fixed">
                                        <input required type='number' v-model="cruiseParms.field3.max" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Max</label>
                                    </div>
                                    <div class="config-field-center config-input-fixed">
                                        <input required type='text' v-model="cruiseParms.field4.name" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Name</label>
                                    </div>
                                    <div class="config-field-center config-input-fixed">
                                        <input required  type='number' v-model="cruiseParms.field4.min" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Min</label>
                                    </div>
                                    <div class="config-field-center config-input-fixed">
                                        <input required  type='number' v-model="cruiseParms.field4.max" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Max</label>
                                    </div>
                                </div>
                                <div class="gridContainer1">
                                    <div class="gridItem config-input-fixed">
                                        <label class="app-input-label">Min {{cruiseParms.field2.name}} for {{cruiseParms.field3.name}}:</label>
                                        <input required type='number' v-model="cruiseParms.field3.field2Min" @change="updateConfig($event.target.value)" />
                                    </div>
                                </div>

                            </div>
                    </transition>
                        <!--**************  SPECIES TAB ***************** -->
                    <transition name="fade">
                        <div class="tab-content" id="species-panel" ref="species-panel" v-if="activeTab=='species'">
                            <div class="gridContainer5 config-margin">
                                <button class="btn--raised" @click="addSpecies()"><i class="material-icons">add</i><span class="app-button-text"> Add</span></button>
                                <label class="gridItem">Species</label>
                                <label class="gridItem">Voice</label>
                                <label class="gridItem">Voice</label>
                                <label class="gridItem">Voice</label>
                                <template v-for="species in speciesKey.species" class="gridContainer5 config-margin" >
                                    <button class="btn--raised"  @click= "deleteSpecies(species)"><i class="material-icons">delete</i><span class="app-button-text"> Delete</span></button>
                                    <div class="config-inputs">
                                        <input required class="gridInputItem" type='text' v-model="species.key" @change="updateConfig($event.target.value)"  />

                                    </div>
                                    <div class="config-inputs">
                                        <input required class="gridInputItem" type='text' v-model="species.names[0]" @change="updateConfig($event.target.value)"  />

                                    </div>
                                    <div class="config-inputs">
                                        <input required class="gridInputItem" type='text' v-model="species.names[1]" @change="updateConfig($event.target.value)"  />

                                    </div>
                                    <div class="config-inputs">
                                        <input required class="gridInputItem" type='text' v-model="species.names[2]" @change="updateConfig($event.target.value)" />

                                    </div>
                                </template>
                            </div>
                        </div>
                    </transition>
                        <!--**************  GRADES TAB ***************** -->
                    <transition name="fade">
                        <div class="tab-content" id="grades-panel" ref="grades-panel" v-if="activeTab=='grades'">
                            <div class="gridContainer2 config-margin">
                                <button class="btn--raised" @click="addGrade()"><i class="material-icons">add</i><span class="app-button-text"> Add</span></button>
                                <label class='gridItem'>Grade</label>
                            </div>
                            <div v-for="grade in gradeKey.grades" class="gridContainer2" >
                            <button class="btn--raised"  @click="deleteGrade(grade)"><i class="material-icons">delete</i><span class="app-button-text"> Delete</span></button>
                                <div class="config-inputs">
                                    <input required class="gridItemLeft gridInputItem" type='text' v-model="grade.name" @change="updateConfig()" />

                                </div>
                            </div>
                        </div>
                    </transition>
                        <!--**************  BAF TAB ***************** -->
                    <transition name="fade">
                        <div class="tab-content" id="baf-panel" ref="baf-panel" v-if="activeTab=='baf'">
                            <div class="gridContainer2 config-margin">
                            <button class="btn--raised" @click="addBAF()"><i class="material-icons">add</i><span class="app-button-text"> Add</span></button>
                                <label class='gridItem'>BAF</label>
                            </div>
                            <div v-for="bafVal in bafArray.values" class="gridContainer2" >
                            <button class="btn--raised"  @click="deleteBAF(bafVal)"><i class="material-icons">delete</i><span class="app-button-text"> Delete</span></button>
                                <div class="config-inputs">
                                    <input required class="gridItemLeft gridInputItem" type='text' v-model="bafVal.value"  @change="updateConfig()" />
                                </div>
                            </div>
                        </div>
                    </transition>
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
            bafArray: null,
            activeTab: 'cruise'
        }
    },
    created () {
        this.loadConfig();
    },
    methods: {
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
    .fade-enter-active, .fade-leave-active {
        transform-origin: center center;
        transition: opacity .4s cubic-bezier(0.25, 0.8, 0.25, 1), transform .4s 0.05s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .fade-enter {
        opacity: 0;
        transform: translateX(-100%);
    }
    .fade-leave-to  {
        opacity: 0;
        transform: translateX(100%);
    }
    .config-header {
        display: flex;
        justify-content: center;
        height: 40px;
    }
    .config-content {
        position: relative;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        margin-top: 30px;

    }
    .tab-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background-color: white;
    }
    .config-input-fixed {
        position: relative;
    }
    .config-header-item {
        padding-top: 15px;
        padding-bottom: 15px;
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
    .config-input-fixed > input {
        max-width: 30vw;
    }
    input[type="radio"] {
        width: 0;
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
