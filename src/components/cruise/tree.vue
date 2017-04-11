<template>
    <div v-if="tree">
        <div class="tree-content">
            <select v-model="tree.field1" class="app-grid-item tree-input" name="field1" >
                <option v-for="species in speciesKey.species" v-bind:value="species.key">
                    {{species.key}}
                </option>
            </select>
            <input  v-model.number="tree.field2" class="app-grid-item tree-input" type="number" name="field2" v-bind:class="{ 'field-invalid': field2Invalid }" @change="validateTree('field2')" >
            <input v-if="!multiProducts" v-model.number="tree.field3" class="app-grid-item tree-input" type="number" name='field3' v-bind:class="{ 'field-invalid': field3Invalid }" @change="validateTree('field3')">
            <button class="app-hide-big-screen btn--raised app-button" @click="toggleSegmentsDialog" v-if="multiProducts" ><i class="material-icons">format_list_numbered</i></button>
            <input v-if="!multiProducts" v-model.number="tree.field4" class="app-grid-item tree-input" type="number" name='field4Name' v-bind:class="{ 'field-invalid': field4Invalid }" @change="validateTree('field4')">
            <template v-for="segment in tree.segments">
                <select v-if="multiProducts" v-model="segment.product" class="app-hide-small-screen app-grid-item tree-input">
                    <option v-for="grade in gradeKey.grades" v-bind:value="grade.name">
                        {{grade.name}}
                    </option>
                </select>
                <input v-if="multiProducts" v-model.number="segment.length" class="app-hide-small-screen app-grid-item tree-input" type="number" >
            </template>
        </div>
        <!-- **** DIALOG for SEGMENT ENTRY **** -->
        <app-dialog v-bind="{showDialog: showSegmentsDialog}" @closeDialog="toggleSegmentsDialog"  ref="segmentDialogRef" v-if="tree">
            <h3 slot="header">Tree Segments</h3>
            <div slot="content">
                <div class="app-grid-3-equal" >
                    <label class="app-grid-item">Seg</label>
                    <label class="app-grid-item">Grade</label>
                    <label class="app-grid-item">Len</label>
                </div>
                <div v-for="segment in tree.segments" class="app-grid-3-equal">
                    <span class="grid-Item">{{segment.id}}</span>
                    <select class='app-grid-item app-select segment-input' v-model="segment.product">
                        <option v-for="grade in gradeKey.grades" v-bind:value="grade.name">
                            {{grade.name}}
                        </option>
                    </select>
                    <input required class="app-grid-item segment-input" type="number" v-model.number="segment.length">
                </div>
            </div>
            <div slot="footer">
                <button @click="toggleSegmentsDialog" class="btn--raised app-button tree-button-done">
                    <i class="material-icons">done</i>
                    <span class="app-button-text">Done</span>
                </button>
            </div>
        </app-dialog>
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
            showSegmentsDialog: false,
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
        toggleSegmentsDialog () {
            this.showSegmentsDialog = !this.showSegmentsDialog;
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
    justify-content: center;
}
div > select, div > input {
    height:100%;
}
div > button {
    margin: 0 0 5px 0;
    padding: 0 0 0 0;
    justify-self: center;
}
.tree-button-done {
    padding: 5px;
}
.segment-input {
    /*font-size: inherit;*/
    width: 80%;
    box-sizing: border-box;
    padding-bottom: 0px;
    padding: 0 0 0 0;
    margin: 0 0 0 0;
    margin-top: 5px;
}
.tree-input {
    /*font-size: inherit;*/
    width:100%;
    background-color: #fff;
    border: 1px solid #ccc;
    box-sizing: border-box;
    padding-bottom: 0px;
    padding: 0 0 0 0;
    margin: 0 0 0 0;
    border-collapse: collapse;
    outline: none;
    background: none;

}
.field-invalid {
    background-color: #F00;
}
.tree-dialog {
    max-width: 80%;
    min-height: 450px;
}
.app-button {
    min-width: 50px;
}
.app-grid-3-equal {
    align-items: flex-end;
}
h4 {
    padding-top: 0;
}
</style>
