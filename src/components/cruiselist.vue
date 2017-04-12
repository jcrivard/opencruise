<template>
   <div id="app-cruiselist">
        <div id="cruiseListPage" class="page">
            <div class="app-fade">
                <h3>Timber Cruises</h3>
                <div class="app-content" id="cruiseListContent" >
                    <ul id="cruiseListContainer">
                        <li v-for="cruise in state.cruiseList" class="app-grid-3">
                            <div class="app-grid-item">
                                <span>{{cruise.cruiseName}}</span><br>
                                <span>{{cruise.date}}</span>
                            </div>
                            <router-link :to="{ name: 'cruise', params: { cruiseid: cruise.cruiseid, cruise: cruise }}">
                                <button class="btn--raised">
                                    <i class="material-icons">edit</i>
                                    <span class="app-button-text">Edit</span>
                                </button>
                            </router-link>
                            <button class="btn--raised" @click="openDeleteDialog(cruise.cruiseid)">
                                <i class="material-icons">delete</i>
                                <span class="app-button-text"> Delete</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <!--app-delete-dialog [cruiseid]="cruiseToDelete" (deleteCruiseEvent)="onDeleteCruiseEvent($event)"></app-delete-dialog>
            <app-welcome-dialog></app-welcome-dialog-->
        </div>
    <app-dialog ref="deleteDialog" v-bind="{showDialog: showDeleteDialog}">
        <h3 slot="header">Delete Cruise</h3>
        <div slot="content">
                Press "OK" to confirm cruise deletion of cruiseid: {{cruiseToDelete}}.
        </div>
        <div slot="footer">
            <button class="btn--raised app-button" @click="deleteCruise" >OK</button>
            <button class="btn--raised app-button" @click="toggleDeleteDialog" >Cancel</button>
        </div>
    </app-dialog>
    <app-dialog ref="welcomeDialog" v-bind="{showDialog: showWelcomeDialog}" @closeDialog="toggleWelcomeDialog">
        <h3 slot="header">OpenCruise</h3>
        <div slot="content">
                Welcome to OpenCruise!  Tap the nav menu button to get started.
        </div>
    </app-dialog>
   </div>
</template>

<script>

export default {
    name: 'app-cruiselist',
    inject: ['cruiseStore'],
    data () {
        return {
            state: {},
            cruiseToDelete: null,
            showDeleteDialog: false,
            showWelcomeDialog: false
        }
    },
    mounted () {
        this.state = this.cruiseStore.state;
        if (this.state.cruiseList.length === 0) {
            this.toggleWelcomeDialog();
        }
    },
    methods: {
        openDeleteDialog (cruiseid) {
            this.cruiseToDelete = cruiseid;
            this.toggleDeleteDialog();
        },
        toggleDeleteDialog () {
            this.showDeleteDialog = !this.showDeleteDialog;
        },
        toggleWelcomeDialog () {
            this.showWelcomeDialog = !this.showWelcomeDialog;
        },
        deleteCruise () {
            this.toggleDeleteDialog();
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
    @media (max-width: 600px) {
        button {
            min-width: 30px;
            padding-left: 8px;
            padding-right: 8px;
        }
    }
</style>
