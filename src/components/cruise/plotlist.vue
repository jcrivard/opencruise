<template>
    <dialog ref="plotlistRef" class="mdl-dialog">
        <div class="pl-header">
            <h2 class="mdl-dialog__title">Select Plot</h2>
            <span  @click="sendClosePlotlistEvent" >
                <md-icon>close</md-icon>
            </span>
        </div>
        <div class="mdl-dialog__content">
            <ul class='mdl-list'>
                <li class="mdl-list__item" v-for="(plot, index) in plotlist"  >
                    <a  v-bind:tabindex="index" @click="openPlot(plot.plotnum)" class="plotLink">
                        <md-icon>edit</md-icon>
                        <span>Plot#: {{plot.plotnum}}, PlotID: {{plot.plotID}}</span>
                    </a>
                </li class="mdl-list__item">
            </ul>
        </div>
        <div class="mdl-dialog__actions">
            <md-button @click="sendClosePlotlistEvent" class="md-raised">Close</md-button>
        </div>
    </dialog>
</template>

<script>
export default {
    name: 'cruise-plotlist',
    props: ['cruise', 'showPlotlist'],
    data () {
        return {
            plotlist: null
        }
    },
    watch: {
        showPlotlist: function(val) { //opening/closing of the dialog is controlled by the parent
            val === true ? this.$refs.plotlistRef.showModal() : this.closeDialog(); //toggle dialog when parent updates visibility
        }
    },
    created() {
        this.plotlist = this.cruise.plots;
    },
    mounted() {
        //window.dialogPolyfill.registerDialog(this.$refs.plotlistRef); //polyfill for html dialog element
    },
    methods: {
        openPlot(plotnum) {
            this.sendClosePlotlistEvent();
            let newPath = '/cruise/' + this.cruise.cruiseid + '/plot/' + plotnum;
            this.$router.push({ path: newPath });
        },
        closeDialog() {
            this.$refs.plotlistRef.close();
        },
        sendClosePlotlistEvent() {
             this.$emit('closePlotList');  //to be consistent, we let parent close dialog by toggling showPlotList
        }
    }
}
</script>

<style scoped>
    .plotLink {
        color:black;
        text-decoration-line: none;
    }
    .pl-close-btn {
        /*position: fixed;*/
    }
    .pl-header {
        display: grid;
        justify-content: end;
        grid-auto-columns: .8fr .1fr;
        grid-auto-flow: column;
    }
    .mdl-button--fab:focus:not(:active) {
        box-shadow: 0 1px 1.5px 0 rgba(0,0,0,.12),0 1px 1px 0 rgba(0,0,0,.24);
        background-color: rgba(158,158,158,.2);
    }
    a:hover {
        background-color: #fe9;
        cursor: pointer;
    }
    ul {
        margin-bottom: 0px;
    }
    h2, ul, li {
        padding: 0px 0px 0px 0px;
        margin-top: 0px;
    }
    ul > li {
        padding-bottom: 15px;
    }
    .mdl-dialog__content {
        padding-top: 0px;
        padding-bottom: 0px;
    }
</style>
