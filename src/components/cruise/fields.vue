<template>
    <div>
        <div class="gridContainer3Equal">
            <label>Name</label>
            <label>Min</label>
            <label>Max</label>
            <div>
                <input required type="text" required class="gridInputItem" ref='field2Name' v-model="cruise.field2.name" @change="sendUpdateFieldsEvent()" />
            </div>
            <div>
                <input required class="gridInputItem" type="number" v-model.number="cruise.field2.min" @change="sendUpdateFieldsEvent()" />
            </div>
            <div>
                <input required class="gridInputItem" type="number" v-model.number="cruise.field2.max" @change="sendUpdateFieldsEvent()" />
            </div>
            <div>
                <input required class="gridInputItem" type="text" ref='field3Name' v-model="cruise.field3.name" @change="sendUpdateFieldsEvent()" />
            </div>
            <div>
                <input required class="gridInputItem" type="number" v-model.number="cruise.field3.min" @change="sendUpdateFieldsEvent()" />
            </div>
            <div>
                <input required class="gridInputItem" type="number" v-model.number="cruise.field3.max" @change="sendUpdateFieldsEvent()" />
            </div>
            <div>
                <input required class="gridInputItem" type="text" v-model="cruise.field4.name" @change="sendUpdateFieldsEvent()" />
            </div>
            <div>
                <input required class="gridInputItem" type="number" v-model.number="cruise.field4.min" @change="sendUpdateFieldsEvent()" />
            </div>
            <div>
                <input required class="gridInputItem" type="number" v-model.number="cruise.field4.max" @change="sendUpdateFieldsEvent()" />
            </div>
        </div>
        <div class="field-container">
            <label>Min {{cruise.field2.name}} for {{cruise.field3.name}}:</label>
            <input class="gridInputItem" type="number" v-model.number="cruise.field3.field2Min" @change="sendUpdateFieldsEvent()" />
        </div>
    </div>
</template>
<script>

export default {
    name: 'cruise-fields',
    props: ['cruise'],
    methods: {
        sendUpdateFieldsEvent() {
            this.$emit('updateFields', [this.cruise.field2, this.cruise.field3, this.cruise.field4]);
        }
    }
}
</script>

<style scoped>
    .field-container {
        display: flex;
        align-items: center;
    }
    .gridInputItem {
        width: 100px;
        margin-bottom: 0;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-right: 10px;
    }
    h2 {
        padding-top: 0;
    }
    label {
        font-weight: bold;
    }
</style>
