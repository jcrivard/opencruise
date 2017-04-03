<template>
    <div class="cm-menu">
        <md-button ref="cruiseMenuButton" id="cruise-menu-button" class="md-icon-button md-raised app-button" @click.native="toggleCruiseNav">
            <md-icon>more_vert</md-icon>
        </md-button>
        <md-sidenav id="app-menu" class="md-right cm-sidenav" ref="cruiseNav">
            <ul>
                <li>
                    <a class="cm-item cm-item-right" v-on:click="onNewPlot(cruise.cruiseid)"><span>New Plot </span><md-icon>add_circle</md-icon></a>
                </li>
                 <li>
                    <a class="cm-item cm-item-right" v-on:click="sendActionEvent('plotlist')"><span>Plot List </span><md-icon>collections</md-icon></a>
                </li>
                 <li>
                    <a class="cm-item cm-item-right" v-on:click="sendActionEvent('stats')"><span>Statistics </span><md-icon>assessment</md-icon></a>
                </li>
                 <li>
                    <a class="cm-item cm-item-right" v-on:click="sendActionEvent('fields')"><span>Fields </span><md-icon>assignment</md-icon></a>
                </li>
                 <li>
                    <a class="cm-item cm-item-right" v-on:click="sendActionEvent('download')"><span>Download </span><md-icon>file_download</md-icon></a>
                </li>
            </ul>
        </md-sidenav>
    </div>
</template>

<script>
//import { cruiseStore } from '../../store/cruisestore'
export default {
    name: 'cruise-menu',
    props: ['cruise'],
    inject: ['cruiseStore'],
    methods: {
        toggleCruiseNav() {
            this.$refs.cruiseNav.toggle()
        },
        onNewPlot(cruiseid) {
            let cruiseidRoute = cruiseid;
            this.cruiseStore.newPlot(cruiseid).then(plot => {
                let newPath = '/cruise/' + cruiseid + '/plot/' + plot.plotnum;
                this.$router.push({ path: newPath });
            });
        },
        sendActionEvent(action) {
            this.$emit('actionEvent', action);
        }
    }
}
</script>

<style scoped>
    .cm-item, .fa {
        font-size: 2.0rem;
        font-family: Baskerville, "Baskerville Old Face", "Goudy Old Style", Garamond, "Times New Roman", serif;
        overflow: hidden;
        line-height: 3.0rem;
    }
    .cm-item-right {
        padding-right: 5px;
    }
    .cm-menu {
        position: fixed;
        top: 0vh;
        right: 0vw;
        z-index: 2;
    }
    .app-button {
        margin-top: 2px;
        margin-right: 10px;
    }

    a {
        color: black !important;
    }
    ul {
        list-style: none;
        padding-left: 0;
        padding-right: 10px;
    }
    li {
        text-align: right;
    }
</style>
