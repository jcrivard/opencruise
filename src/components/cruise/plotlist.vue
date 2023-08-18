<template>
    <div>
        <ul>
            <li class="pl-item" v-for="(plot, index) in plotlist" :key="plot.plotnum" >
                <a v-bind:tabindex="index" @click="openPlot(plot.plotnum)" class="pl-link">
                    <i class="material-icons">edit</i>
                    <span>Plot#: {{plot.plotnum}}, PlotID: {{plot.plotID}}</span>
                </a>
                <a @click="openPlotDeleteDialog(plot.plotnum)" class="pl-link">
                    <i class="material-icons pl-right">delete</i>
                </a>
            </li>
        </ul>
        <app-dialog ref="deletePlotDialog" v-bind="{showDialog: showPlotDeleteDialog}">
            <h3 slot="header">Delete Plot</h3>
            <div slot="content">
                    Press "OK" to confirm delete of plot number: {{plotToDelete}}
            </div>
            <div slot="footer">
                <button class="btn--raised app-button" @click="deletePlot" >OK</button>
                <button class="btn--raised app-button" @click="togglePlotDeleteDialog" >Cancel</button>
            </div>
        </app-dialog>
    </div>
</template>

<script>
export default {
    name: 'cruise-plotlist',
    inject: ['cruiseStore'],
    props: ['cruise', 'showPlotlist'],
    data () {
        return {
            plotlist: null,
            showPlotDeleteDialog: false,
            plotToDelete: null
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
        deletePlot() {
            for (let i = this.cruise.plots.length - 1; i >= 0; --i) {
                if (this.cruise.plots[i].plotnum === this.plotToDelete) {
                    this.cruise.plots.splice(i, 1);
                }
            }
            if (this.plotToDelete) {
                this.cruiseStore.updateCruise({cruiseid: this.cruise.cruiseid}).then(result => {
                    this.plotToDelete = null;
                });
            }
            this.togglePlotDeleteDialog();
        },
        openPlotDeleteDialog (plotnum) {
            this.plotToDelete = plotnum;
            this.togglePlotDeleteDialog();
        },
        togglePlotDeleteDialog () {
            this.showPlotDeleteDialog = !this.showPlotDeleteDialog;
        },
        closeDeleteDialog () {
            this.$refs.deletePlotDialog.close();
        },
        sendClosePlotlistEvent() {
             this.$emit('closePlotList');  //to be consistent, we let parent close dialog by toggling showPlotList
        }
    }
}
</script>

<style scoped lang="scss">
@import '../../variables';
    .pl-link {
        color:$opencruise-text-color !important;
        text-decoration-line: none;
        font-size: 2rem;
        padding-bottom: 8px;
        padding-top: 8px;
        vertical-align: middle;
    }
    .pl-right {
        margin-left: 10px;
        margin-right: 10px;
    }
    a:hover {
        background-color: $opencruise-accent;
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
