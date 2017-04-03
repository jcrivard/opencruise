<template>
    <div v-if="tree">
        <div class="tree-content">
            <select v-model="tree.field1" class="gridItem tree-input" name="field1" >
                <option v-for="species in speciesKey.species" v-bind:value="species.key">
                    {{species.key}}
                </option>
            </select>
            <input  v-model.number="tree.field2" class="gridItem tree-input" type="number" name="field2" v-bind:class="{ 'field-invalid': field2Invalid }" @change="validateTree('field2')" >
            <input v-if="!multiProducts" v-model.number="tree.field3" class="gridItem tree-input" type="number" name='field3' v-bind:class="{ 'field-invalid': field3Invalid }" @change="validateTree('field3')">
            <md-button class="bigScreenHide md-raised" @click="openSegmentDialog()" v-if="multiProducts" ><md-icon>format_list_numbered</md-icon></md-button>
            <input v-if="!multiProducts" v-model.number="tree.field4" class="gridItem tree-input" type="number" name='field4Name' v-bind:class="{ 'field-invalid': field4Invalid }" @change="validateTree('field4')">
            <template v-for="segment in tree.segments">
                <select v-if="multiProducts" v-model="segment.product" class="smallScreenHide gridItem tree-input">
                    <option v-for="grade in gradeKey.grades" v-bind:value="grade.name">
                        {{grade.name}}
                    </option>
                </select>
                <input v-if="multiProducts" v-model.number="segment.length" class="smallScreenHide gridItem tree-input" type="number" >
            </template>
        </div>
        <!-- **** DIALOG for SEGMENT ENTRY **** -->
        <dialog class="fade-in-out mdl-dialog" ref="segmentDialogRef" v-if="tree">
            <h3 class="mdl-dialog__title">Tree Segments</h3>
            <div class="mdl-dialog__content">
                <div class="gridContainer3Equal" >
                    <label class="gridItem">Seg</label>
                    <label class="gridItem">Grade</label>
                    <label class="gridItem">Len</label>
                </div>

                <div v-for="segment in tree.segments" class="gridContainer3Equal">
                    <span class="grid-Item">{{segment.id}}</span>
                    <select class='gridItem tree-input' v-model="segment.product">
                        <option v-for="grade in gradeKey.grades" v-bind:value="grade.name">
                            {{grade.name}}
                        </option>
                    </select>
                    <input class="gridItem tree-input" type="number" v-model.number="segment.length">
                </div>
                <div class="mdl-dialog__actions">
                    <md-button class="md-raised" @click="closeSegmentDialog"><md-icon>done</md-icon><span class="btn-text"> Done</span></md-button>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script>
export default {
    name: 'cruise-plotlist',
    props: ['multiProducts', 'cruiseid', 'tree'],
    inject: ['cruiseStore'],
    data () {
        return {
            speciesKey: null,
            gradeKey: null,
            cruise: null,
            showSegmentDialog: false,
            field2Invalid: false,
            field3Invalid: false,
            field4Invalid: false
        }
    },
    created () {
        this.speciesKey = this.cruiseStore.state.config.speciesKey;
        this.gradeKey = this.cruiseStore.state.config.gradeKey;
        this.cruiseStore.getCruise(this.cruiseid).then(result => {  //need field values (min, max) to do tree validation/assign color if wrong
            this.cruise = result;
            this.validateTree('field2');
            this.validateTree('field3');
            this.validateTree('field4');
        }, err => {});
    },
    mounted () {
        //window.dialogPolyfill.registerDialog(this.$refs.segmentDialogRef); //polyfill for html dialog element
    },
    methods: {
        openSegmentDialog () {
            this.$refs.segmentDialogRef.showModal();
        },
        closeSegmentDialog () {
            this.$refs.segmentDialogRef.close();
        },
        validateTree (fieldName) {
            if (this.tree[fieldName] !== null) { //don't bother with new/empty trees/fields
                this.field2Invalid = false;
                this.field3Invalid = false;
                this.field4Invalid = false;
                if ((this.tree.field2 > 0) && (this.tree.field3 > 0) && (this.tree.field2 < this.cruise.field3.field2Min)) { // check dbh to see if big enought for sawlogs
                    this.field2Invalid = true;
                    this.field3Invalid = true;
                }
                if ((this.tree.field2 < this.cruise.field2.min) || (this.tree.field2 > this.cruise.field2.max)) { //field in between min and max?
                    this.field2Invalid = true;
                }
                if ((this.tree.field3 < this.cruise.field3.min) || (this.tree.field3 > this.cruise.field3.max)) { //field in between min and max?
                    this.field3Invalid = true;
                }
                if ((this.tree.field4 < this.cruise.field4.min) || (this.tree.field4 > this.cruise.field4.max)) { //field in between min and max?
                    this.field4Invalid = true;
                }
            }
        }
    }
}
</script>

<style scoped>
.tree-content {
    padding-left: 5px;
    padding-right:5px;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
}
div > select, div > input {
    height:100%;
}
div > button {
    margin-bottom: 5px;
}
.tree-input {
    /*font-size: inherit;*/
    width:100%;
    background-color: #fff;
    border: 1px solid #ccc;
    box-sizing: border-box;
    padding-bottom: 0px;

}
.field-invalid {
    background-color: #F00;
}
dialog {
    max-width: 80%;
}
</style>
