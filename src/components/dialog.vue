<template>
<div>
<div class="backdrop" v-if="showDialog"></div>
    <div class="dialog-container" v-bind:class="{'container-active': showDialog}">
        <transition name="fade">
            <div  v-if="showDialog" class="dialog" >
                <div class="header">
                    <slot name="header">
                        Dialog Header
                    </slot>
                </div>
                <div class="content">
                    <slot name="content">
                        Dialog Content
                    </slot>
                </div>
                <div class="footer">
                    <slot name="footer">
                        <button @click="sendCloseDialogEvent" class="btn--raised dialog-button">
                            <i class="material-icons">close</i>
                            <span class="app-button-text">Close</span>
                        </button>
                    </slot>
                </div>
                </slot>
            </div>
        </transition>
    </div>
</div>

</template>
<script>
export default {
    props: ['showDialog'],
    methods: {
        sendCloseDialogEvent() {
             this.$emit('closeDialog');  //to be consistent, we let parent close dialog by toggling showPlotList
        }
    }
}
</script>

<style scoped>
    .header {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .footer {
        display: flex;
        justify-content: flex-end;
        padding: 10px;
    }
    .content {
        padding-top: 15px;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 15px;
        max-height: 70vh;
        overflow-y: auto;
        height: auto;
    }
    .backdrop {
        background-color: rgba(0, 0, 0, 0.54);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
    }
    .dialog-container {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        background: transparent;
        justify-content: center;
    }
    .dialog-button {
        height: 34px;
    }
    .container-active {
        z-index: 1;
    }
    .fade-enter-active, .fade-leave-active {
        transform-origin: center center;
        transition: opacity .4s cubic-bezier(0.25, 0.8, 0.25, 1), transform .4s 0.05s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .fade-enter, .fade-leave-to  {
        opacity: 0;
        transform: scale(0.9,0.85);
    }
    .dialog {
        background-color: white;
        min-width: 280px;
        max-width: 80%;
        max-height: 85%;
        min-height: 140px;
        display: flex;
        flex-flow: column;
        overflow: hidden;
        position: absolute;
        z-index: 110;
        outline: none;
        border-radius: 2px;
        top: 50px;
        box-shadow: 0 7px 9px -4px rgba(0, 0, 0, 0.2), 0 14px 21px 2px rgba(0, 0, 0, 0.14), 0 5px 26px 4px rgba(0, 0, 0, 0.12);
    }

</style>
