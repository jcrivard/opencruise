<template>
    <div id="app-toolbar">
        <md-toolbar class="toolbar">
            <md-button ref="appMenuButton" id="app-menu-button" class="md-raised app-button md-icon-button" @click.native="toggleNavMenu">
                <md-icon>menu</md-icon>
            </md-button>
        </md-toolbar>
        <md-sidenav id="app-menu" class="md-left" ref="navMenu">
            <ul>
                <li>
                    <router-link to="/cruiselist"  class="navbarItem navbarItemLeft" ><md-icon>home</md-icon><span> Home</span></router-link>
                </li>
                <li v-if="cruiseid">
                    <router-link v-bind:to="{name: 'cruise', params: {cruiseid: cruiseid}}"  class="navbarItem navbarItemLeft" ><md-icon>work</md-icon><span> Cruise Info</span></router-link>
                </li>
                <li>
                    <a  ref="fullscreenElement" id="fullscreenElem" class="navbarItem navbarItemLeft"  @click="toggleFullscreen()"><md-icon>fullscreen</md-icon><span> Full Screen</span></a>
                </li>
                <li>
                    <a class="navbarItem navbarItemLeft"  v-on:click="newCruise()"><md-icon>add_box</md-icon><span> New Cruise</span></a>
                </li>
                <li>
                    <router-link to="/config"  class="navbarItem navbarItemLeft" ><md-icon>settings</md-icon><span> Config</span></router-link>
                </li>
                <li>
                    <router-link to="/help"  class="navbarItem navbarItemLeft" ><md-icon>help</md-icon><span> Help</span></router-link>
                </li>
                <li>
                    <router-link to="/about"  class="navbarItem navbarItemLeft" ><md-icon>info</md-icon><span> About</span></router-link>
                </li>
            </ul>
        </md-sidenav>

    </div>
</template>

<script>
import { cruiseStore } from '../store/cruisestore'
export default {
    name: 'app-toolbar',
    data () {
        return {
            cruiseid: null
        }
    },
    mounted() {
        if(this.$route.params.hasOwnProperty('cruiseid')) {
             this.cruiseid = this.$route.params.cruiseid;
        }
    },
    methods: {
        newCruise(event) {
            cruiseStore.newCruise().then(results => {
                let jim = '';
            });
        },
        toggleFullscreen() {
            function exitFullscreen() {
                document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
                if(document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            function launchFullscreen() {
                let element = document.documentElement;
                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                if(element.requestFullscreen) {
                    element.requestFullscreen();
                }
            }
            let element = this.$refs.fullscreenElement;
            let returnValue = false;
            let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
            if (fullscreenElement) { //fullscreenEnabled always returns true, use fullscreenElement which should be null or undefined when not in fullscreen
                exitFullscreen();
            } else {
                launchFullscreen();
            }
        },
        toggleNavMenu() {
            this.$refs.navMenu.toggle();
        }
    }
}
</script>

<style scoped>

a {
    color: black !important;
}
ul {
    list-style: none;
    padding-left: 10px;
}
</style>
