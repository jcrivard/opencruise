<template>
    <div class="baf-radio">
        <label v-for="bafVal in bafArray.values">
            <input  type="radio" name="BAF-Radio" v-bind:id="'BAF' + bafVal.value" v-model="cruiseBAF" v-on:change="sendUpdateCruiseEvent($event)"  v-bind:value="bafVal.value"/>
            <label :for="'BAF' + bafVal.value">{{bafVal.value}}</label>
        </label>
    </div>
</template>

<script>
    export default {
        name: 'cruise-baf',
        props: ['inputBAF'],
        inject: ['cruiseStore'],
        data () {
            return {
                bafArray: [],
                currentBAF: null
            }
        },
        created () {
            this.bafArray = this.cruiseStore.state.config.bafArray;
            this.cruiseBAF = this.inputBAF;
        },
        methods: {
            sendUpdateCruiseEvent(event) {
                let updateObj = {BAF: parseInt(event.target.value)};
                this.$emit('updateCruiseEvent', updateObj);
            }
        }
    }
</script>

<style scoped lang="scss">
@import '../../variables';
input[type="radio"] {
    height: 0;
    width: 0;
    position: absolute;
    margin: 0;
    z-index: -1;
}
input[type="radio"] ~ label {
  background-color: $opencruise-radio-inactive;
  padding: 10px 16px 10px 16px;
  height: initial;

}
input[type="radio"]:checked ~ label, {
    background-color: $opencruise-radio-active !important;
}
:first-child > label {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
}
:last-child > label{
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
}
.baf-radio {
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    border-radius: 5px;
    display: flex;
}
</style>
