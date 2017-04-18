<template>
    <div id="app-toolbar" class="toolbar" v-if="showToolbar">
            <input type="checkbox" id="navMenu" ref="navMenu" class="nav--super-vertical-responsive">
            <label class="app-button" for="navMenu"><i class="material-icons">menu</i></label>
            <div class="nav--super-vertical  no-margin-vertical">
                <ul>
                    <li>
                        <router-link to="/cruiselist" @click.native="toggleNavMenu" class="navbarItem navbarItemLeft" ><i class="material-icons">home</i><span> Home</span></router-link>
                    </li>
                    <li v-if="showCruise">
                        <router-link @click.native="toggleNavMenu" v-bind:to="{name: 'cruise', params: {cruiseid: cruiseid}}"  class="navbarItem navbarItemLeft" ><i class="material-icons">work</i><span> Cruise Info</span></router-link>
                    </li>
                    <li>
                        <a ref="fullscreenElement" id="fullscreenElem" class="navbarItem navbarItemLeft"  @click="toggleFullscreen()"><i class="material-icons">fullscreen</i><span> Full Screen</span></a>
                    </li>
                    <li>
                        <a class="navbarItem navbarItemLeft"  v-on:click="newCruise()"><i class="material-icons">add_box</i><span> New Cruise</span></a>
                    </li>
                    <li>
                        <router-link to="/config" @click.native="toggleNavMenu" class="navbarItem navbarItemLeft" ><i class="material-icons">settings</i><span> Config</span></router-link>
                    </li>
                    <li>
                        <router-link to="/help" @click.native="toggleNavMenu" class="navbarItem navbarItemLeft" ><i class="material-icons">help</i><span> Help</span></router-link>
                    </li>
                </ul>
            </div>

    </div>
</template>

<script>

export default {
    name: 'app-toolbar',
    inject: ['cruiseStore'],
    data () {
        return {
            cruiseid: null
        }
    },
    computed: {
        showCruise: function() {
            if(this.$route.params.hasOwnProperty('cruiseid')) {
                this.cruiseid = this.$route.params.cruiseid;
                return true;
            } else {
                return false;
            }
        },
        showToolbar: function() {
            if(this.$route.fullPath === '/') {
                return false;
            } else {
                return true;
            }
        }
    },
    methods: {
        newCruise(event) {
            this.toggleNavMenu();
            this.cruiseStore.newCruise().then(results => {
                let jim = '';
            });
        },
        toggleFullscreen() {
            this.toggleNavMenu();
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
            this.$refs.navMenu.checked = false;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../variables';
.toolbar {
  background-color: $opencruise-toolbar-background !important;
  padding-right: 1rem;
  padding-left: 1rem;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  height: 40px !important;
  min-height: 40px !important;
  width: 100vw;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 2;
}
a {
    color: $opencruise-text-color !important;
}
ul {
    list-style: none;
    margin-left: 0;
}
</style>
