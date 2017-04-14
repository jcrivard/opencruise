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
