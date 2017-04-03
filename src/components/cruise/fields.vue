<template>
<dialog class="fade-in-out mdl-dialog" ref="fieldsRef"  v-if="cruise">
    <h2 class="mdl-dialog__title">Fields</h2>
    <div class="mdl-dialog__content gridContainer3Equal">
        <label>Name</label>
        <label>Min</label>
        <label>Max</label>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input mdInput class="mdl-textfield__input gridInputItem" type='text' ref='field2Name' v-model="cruise.field2.name" @change="sendUpdateFieldsEvent()" />
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input mdInput class="mdl-textfield__input gridInputItem" type="number" v-model.number="cruise.field2.min" @change="sendUpdateFieldsEvent()" />
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input mdInput class="mdl-textfield__input gridInputItem" type="number" v-model.number="cruise.field2.max" @change="sendUpdateFieldsEvent()" />
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input mdInput class="mdl-textfield__input gridInputItem" type='text' ref='field3Name' v-model="cruise.field3.name" @change="sendUpdateFieldsEvent()" />
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input mdInput class="mdl-textfield__input gridInputItem" type="number" v-model.number="cruise.field3.min" @change="sendUpdateFieldsEvent()" />
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input mdInput class="mdl-textfield__input gridInputItem" type="number" v-model.number="cruise.field3.max" @change="sendUpdateFieldsEvent()" />
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input mdInput class="mdl-textfield__input gridInputItem" type='text' v-model="cruise.field4.name" @change="sendUpdateFieldsEvent()" />
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input mdInput class="mdl-textfield__input gridInputItem" type="number" v-model.number="cruise.field4.min" @change="sendUpdateFieldsEvent()" />
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input mdInput class="mdl-textfield__input gridInputItem" type="number" v-model.number="cruise.field4.max" @change="sendUpdateFieldsEvent()" />
        </div>
    </div>
    <div class="gridContainer2 mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <label class="gridItemRight">Min {{cruise.field2.name}} for {{cruise.field3.name}}:</label>
        <div>
            <input mdInput class="mdl-textfield__input gridItemLeft gridInputItem" type="number" v-model.number="cruise.field3.field2Min" @change="sendUpdateFieldsEvent()" />
        </div>
    </div>
    <div class="mdl-dialog__actions">
        <md-button @click="sendCloseFieldsEvent" class="md-raised">Close</md-button>
    </div>
</dialog>
</template>
<script>
export default {
    name: 'cruise-fields',
    props: ['cruise', 'showFields'],
    watch: {
        showFields: function(val) { //opening/closing of the dialog is controlled by the parent
            if (val === true) {
                this.openDialog();
            } else {
                this.closeDialog(); //toggle dialog when parent updates visibility
            }
        }
    },
    mounted() {
        //window.dialogPolyfill.registerDialog(this.$refs.fieldsRef); //polyfill for html dialog element
    },
    methods: {
        openDialog() {
            this.$refs.fieldsRef.showModal();
        },
        closeDialog() {
            this.$refs.fieldsRef.close();
        },
        sendUpdateFieldsEvent() {
            this.$emit('updateFields', [this.cruise.field2, this.cruise.field3, this.cruise.field4]);
        },
        sendCloseFieldsEvent() {
             this.$emit('closeFields');  //to be consistent, we let parent close dialog by toggling showPlotList
        }
    }
}
</script>

<style>
    .mdl-dialog {
        position: absolute;
        top: 20px;
    }
</style>
