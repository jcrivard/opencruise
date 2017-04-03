<template>
   <div id="app-cruiselist">
        <div id="cruiseListPage" class="page">
            <div class="fade-in-out">
                <h3>Timber Cruises</h3>
                <div class="content-main" id="cruiseListContent" >
                    <ul class="list-group" id="cruiseListContainer">
                        <li v-for="cruise in state.cruiseList" class="gridContainer3 list-group-item">
                            <div class="gridItem">
                                <span>{{cruise.cruiseName}}</span><br>
                                <span>{{cruise.date}}</span>
                            </div>
                            <router-link :to="{ name: 'cruise', params: { cruiseid: cruise.cruiseid, cruise: cruise }}">
                                <md-button class="md-raised app-button gridItem">
                                    <md-icon>edit</md-icon>
                                    <span class="btn-text">Edit</span>
                                </md-button>
                            </router-link>
                            <md-button class="md-raised app-button gridItem" @click.native="openDeleteDialog(cruise.cruiseid)">
                                <md-icon>delete</md-icon>
                                <span class="btn-text"> Delete</span>
                            </md-button>
                        </li>
                    </ul>
                </div>
            </div>
            <!--app-delete-dialog [cruiseid]="cruiseToDelete" (deleteCruiseEvent)="onDeleteCruiseEvent($event)"></app-delete-dialog>
            <app-welcome-dialog></app-welcome-dialog-->
        </div>
    <md-dialog ref="deleteDialog">
        <md-dialog-title>Delete Cruise</md-dialog-title>
        <md-dialog-content>
                Press "OK" to confirm cruise deletion of cruiseid: {{cruiseToDelete}}.
        </md-dialog-content>
        <md-dialog-actions>
            <md-button class="md-raised md-primary" @click.native="deleteCruise()" >OK</md-button>
            <md-button class="md-raised md-primary" @click.native="closeDeleteDialog()" >Cancel</md-button>
        </md-dialog-actions>
    </md-dialog>
   </div>
</template>

<script>

export default {
    name: 'app-cruiselist',
    inject: ['cruiseStore'],
    data () {
        return {
            state: {},
            cruiseToDelete: null
        }
    },
    mounted () {
        //window.dialogPolyfill.registerDialog(this.$refs.deleteDialog); //polyfill for html dialog element
        this.state = this.cruiseStore.state;
        //window.componentHandler.upgradeDom(); //for mdl lite
    },
    methods: {
        openDeleteDialog (cruiseid) {
            this.cruiseToDelete = cruiseid;
            this.$refs.deleteDialog.open();
        },
        deleteCruise () {
            this.closeDeleteDialog();
            if (this.cruiseToDelete) {
                this.cruiseStore.deleteCruise(this.cruiseToDelete).then(result => {
                    this.cruiseToDelete = null;
                });
            }
        },
        closeDeleteDialog () {
            this.$refs.deleteDialog.close();
        }
    }
}
</script>

<style scoped>
    .list-group {
        margin-top: 0px;
        margin-bottom: 0px;
    }
    @media (max-width: 600px) {
        button {
            min-width: 30px;
            padding-left: 8px;
            padding-right: 8px;
        }
    }
</style>
