<template>
    <div id="configPage" class="page page-will-change">
        <div class="app-fade" >
            <h3>Defaults</h3>
            <div class="app-content" v-if="cruiseParms">
                <div class="config-header">
                    <button ref="cruise" @click="setFocus('cruise')" class="app-grid-item config-header-item">
                        <input type="radio" name="tabs" id="cruise-tab" value="cruise" v-model="activeTab">
                        <label for="cruise-tab">Cruise</label>
                    </button>
                    <button ref="species" @click="setFocus('species')" class="app-grid-item config-header-item">
                        <input type="radio" name="tabs" id="species-tab" value="species" v-model="activeTab">
                        <label for="species-tab">Species</label>
                    </button>
                    <button ref="grades" @click="setFocus('grades')" class="app-grid-item config-header-item">
                        <input type="radio" name="tabs" id="grades-tab" value="grades" v-model="activeTab">
                        <label for="grades-tab">Grades</label>
                    </button>
                    <button ref="baf" @click="setFocus('baf')" class="app-grid-item config-header-item">
                        <input type="radio" name="tabs" id="baf-tab" value="baf" v-model="activeTab">
                        <label for="baf-tab">BAF</label>
                    </button>
                </div>
                <div class="config-content">
                    <!--**************  CRUISE TAB ***************** -->
                    <transition name="fade">
                            <div class="tab-content" id="cruise-panel" ref="cruise-panel" v-if="activeTab=='cruise'">
                                <div class="app-grid-1 config-margin">
                                    <div class="config-input-fixed">
                                        <input required type='text' id="config-people" v-model="cruiseParms.people" @change="updateConfig()"/>
                                        <label class="app-input-label" for="config-people">Forester Name</label>
                                    </div>
                                    <div class="config-input-fixed">
                                        <input required type='text' v-model="cruiseParms.cruiseName" @change="updateConfig()" />
                                        <label class="app-input-label">Project Name</label>
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
                                <div class="app-grid-3-equal">
                                    <div class="config-input-short config-input-fixed">
                                        <input required type='text' v-model="cruiseParms.field2.name" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Name</label>
                                    </div>
                                    <div class="config-input-short config-input-fixed">
                                        <input required type='number' v-model.number="cruiseParms.field2.min" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Min</label>
                                    </div>
                                    <div class="config-input-short config-input-fixed">
                                        <input required type='number' v-model.number="cruiseParms.field2.max" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Max</label>
                                    </div>
                                    <div class="config-input-short config-input-fixed">
                                        <input required type='text'  v-model="cruiseParms.field3.name" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Name</label>
                                    </div>
                                    <div class="config-input-short config-input-fixed">
                                        <input required type='number' v-model.number="cruiseParms.field3.min" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Min</label>
                                    </div>
                                    <div class="config-input-short config-input-fixed">
                                        <input required type='number' v-model.number="cruiseParms.field3.max" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Max</label>
                                    </div>
                                    <div class="config-input-short config-input-fixed">
                                        <input required type='text' v-model="cruiseParms.field4.name" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Name</label>
                                    </div>
                                    <div class="config-input-short config-input-fixed">
                                        <input required  type='number' v-model.number="cruiseParms.field4.min" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Min</label>
                                    </div>
                                    <div class="config-input-short config-input-fixed">
                                        <input required  type='number' v-model.number="cruiseParms.field4.max" @change="updateConfig($event.target.value)" />
                                        <label class="app-input-label">Max</label>
                                    </div>
                                </div>
                                <div class="app-grid-1" style="margin-top:10px;">
                                    <div class="app-grid-item config-input-fixed">
                                        <label class="app-input-label">Min {{cruiseParms.field2.name}} for {{cruiseParms.field3.name}}:</label>
                                        <input required type='number' v-model.number="cruiseParms.field3.field2Min" @change="updateConfig($event.target.value)" />
                                    </div>
                                </div>

                            </div>
                    </transition>
                        <!--**************  SPECIES TAB ***************** -->
                    <transition name="fade">
                        <div class="tab-content" id="species-panel" ref="species-panel" v-if="activeTab=='species'">
                            <div class="app-grid-2 config-margin">
                                <button class="btn--raised" @click="addSpecies()"><i class="material-icons">add</i><span class="app-button-text"> Add</span></button>
                                <label class="app-grid-item">Species</label>
                                <template v-for="species in speciesKey.species" class="app-grid-5 config-margin" >
                                    <button class="btn--raised"  @click= "deleteSpecies(species)"><i class="material-icons">delete</i><span class="app-button-text"> Delete</span></button>
                                    <div class="config-inputs">
                                        <input required class="app-grid-item-input" type='text' v-model="species.key" @change="updateConfig($event.target.value)"  />

                                    </div>
                                </template>
                            </div>
                        </div>
                    </transition>
                        <!--**************  GRADES TAB ***************** -->
                    <transition name="fade">
                        <div class="tab-content" id="grades-panel" ref="grades-panel" v-if="activeTab=='grades'">
                            <div class="app-grid-2 config-margin">
                                <button class="btn--raised" @click="addGrade()"><i class="material-icons">add</i><span class="app-button-text"> Add</span></button>
                                <label class='app-grid-item'>Grade</label>
                            </div>
                            <div v-for="grade in gradeKey.grades" class="app-grid-2" >
                            <button class="btn--raised"  @click="deleteGrade(grade)"><i class="material-icons">delete</i><span class="app-button-text"> Delete</span></button>
                                <div class="config-inputs">
                                    <input required class="app-grid-itemLeft app-grid-item-input" type='text' v-model="grade.name" @change="updateConfig()" />

                                </div>
                            </div>
                        </div>
                    </transition>
                        <!--**************  BAF TAB ***************** -->
                    <transition name="fade">
                        <div class="tab-content" id="baf-panel" ref="baf-panel" v-if="activeTab=='baf'">
                            <div class="app-grid-2 config-margin">
                            <button class="btn--raised" @click="addBAF()"><i class="material-icons">add</i><span class="app-button-text"> Add</span></button>
                                <label class='app-grid-item'>BAF</label>
                            </div>
                            <div v-for="bafVal in bafArray.values" class="app-grid-2" >
                            <button class="btn--raised"  @click="deleteBAF(bafVal)"><i class="material-icons">delete</i><span class="app-button-text"> Delete</span></button>
                                <div class="config-inputs">
                                    <input required class="app-grid-itemLeft app-grid-item-input" type='text' v-model.number="bafVal.value"  @change="updateConfig()" />
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
        setFocus(tab) {
            setTimeout(() => {
                this.$refs[tab].focus();
                this.activeTab = tab;
            }, 100);
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

<style scoped lang="scss">
@import '../variables';
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
        background-color: $opencruise-content-background;
        padding-bottom: 15px;
        margin-bottom: 15px;
        overflow-x: hidden;
    }
    .config-input-fixed {
        position: relative;
    }
    .config-header-item {
        border-bottom: 1px solid $opencruise-config-border;
        font-size: inherit;
        background-color: inherit;
        padding:0;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        will-change: background-position;
        transition: all .3s cubic-bezier(0.64, 0.09, 0.08, 1);
        background: linear-gradient(to bottom, $opencruise-config-header-background 96%, $opencruise-label-text 96%);
        background-position: -100px 0;
        background-size: 100px 100%;
        background-repeat: no-repeat;
        cursor: pointer;
        outline: none;

    }
    .config-header-item:focus, .config-header-item:hover, .config-header-item:active  {
        background-color:$opencruise-config-border;
        background-position: 0 0;
        border-bottom-color: $opencruise-label-text;
    }
    .config-header-item > label {
        width: 100%;
        height: 100%;
        padding: 10px 10px 5px 10px;
    }
    .config-input-short {
        max-width: 30vw;
        width: 100px;
        overflow: hidden;
    }
    .app-grid-2 {
        justify-content: center;
        grid-template-columns: .15fr .25fr;
    }
    .app-grid-3-equal {
        max-width: 400px;
        margin: auto;
    }
    .app-grid-5 {
        justify-items: center;
        padding-left: 5px;

    }
    .config-inputs > input {
        margin: auto;
        width: 100px;
    }
    .app-grid-5::first-line {
        border-bottom: 1px solid $opencruise-config-border;
    }
    .config-input-fixed > input {
        max-width: 30vw;
    }
    .config-input-short > input {
        width: 100px;
        margin: 0 10px 5px 10px;
    }
    .config-input-short > label {
        left: 10px;
    }
    input[type="radio"] {
        width: 0;
        margin: 0;
        z-index: -1;
    }
    @media (max-device-width: 500px) {
        .config-input-fixed > input {
            max-width: 80%;
        }
        .app-grid-2 {
            grid-template-columns: .25fr .35fr;
        }
        .config-inputs  {
            max-width: 100%;
        }
    }
    @media (max-device-width: 350px) {
        .config-header-item > label {
            width: 100%;
            height: 100%;
            padding: 10px 5px 5px 5px;
        }
    }
</style>
