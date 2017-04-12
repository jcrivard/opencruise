<template>
    <div>
        <ul>
            <li class="pl-item" v-for="(plot, index) in plotlist" :key="plot.plotnum" >
                <a v-bind:tabindex="index" @click="openPlot(plot.plotnum)" class="pl-link">
                    <i class="material-icons">edit</i>
                    <span>Plot#: {{plot.plotnum}}, PlotID: {{plot.plotID}}</span>
                </a>
            </li>
        </ul>
    </div>
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
        sendClosePlotlistEvent() {
             this.$emit('closePlotList');  //to be consistent, we let parent close dialog by toggling showPlotList
        }
    }
}
</script>

<style scoped>
    .pl-link {
        color:black !important;
        text-decoration-line: none;
        font-size: 2rem;
        padding-bottom: 8px;
        padding-top: 8px;
        vertical-align: middle;
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
        margin-left: 0px;
    }
    .pl-item {
        margin-top: 0px;
        display: flex;
        justify-content: center;
    }
    .pl-item > div {
        justify-content: center;
    }
</style>
