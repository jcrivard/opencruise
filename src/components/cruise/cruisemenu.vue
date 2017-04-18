<template>
    <div class="cm-menu">
        <input type="checkbox" id="cruiseNav" ref="cruiseNav" class="nav--super-vertical-responsive nav--super-vertical-responsive-right">
        <label class="app-button" for="cruiseNav"><i class="material-icons">more_vert</i></label>
        <div class="nav--super-vertical nav--super-vertical-right  no-margin-vertical">
            <ul>
                <li>
                    <a class="cm-item cm-item-right" v-on:click="onNewPlot(cruise.cruiseid)"><span>New Plot </span><i class="material-icons">add_circle</i></a>
                </li>
                <li>
                    <a class="cm-item cm-item-right" v-on:click="sendActionEvent('plotlist')"><span>Plot List </span><i class="material-icons">collections</i></a>
                </li>
                <li>
                    <a class="cm-item cm-item-right" v-on:click="sendActionEvent('stats')"><span>Statistics </span><i class="material-icons">assessment</i></a>
                </li>
                <li>
                    <a class="cm-item cm-item-right" v-on:click="sendActionEvent('fields')"><span>Fields </span><i class="material-icons">assignment</i></a>
                </li>
                <li>
                    <a class="cm-item cm-item-right" v-on:click="sendActionEvent('download')"><span>Download </span><i class="material-icons">file_download</i></a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
//import { cruiseStore } from '../../store/cruisestore'
export default {
    name: 'cruise-menu',
    props: ['cruise'],
    inject: ['cruiseStore'],
    methods: {
        onNewPlot(cruiseid) {
            let cruiseidRoute = cruiseid;
            this.cruiseStore.newPlot(cruiseid).then(plot => {
                let newPath = '/cruise/' + cruiseid + '/plot/' + plot.plotnum;
                this.$router.push({ path: newPath });
            });
        },
        sendActionEvent(action) {
            this.$refs.cruiseNav.checked = false;
            this.$emit('actionEvent', action);
        }
    }
}
</script>

<style scoped lang="scss">
    @import '../../variables';
    .cm-item, .fa {
        font-family: $opencruise-font-family;
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
        display: flex;
        justify-content: flex-end;
    }
    .app-button {
        margin-top: 0px;
        margin-right: 10px;
        position: relative;
    }

    a {
        color: $opencruise-text-color !important;
        padding-left: 0;
    }
    ul {
        list-style: none;
        padding-left: 0;
        padding-right: 10px;
        margin-left: 0;
    }
    li {
        text-align: right;
        display: flex;
        justify-content: flex-end;
    }
</style>
