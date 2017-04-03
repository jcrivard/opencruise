<template>
    <div id="app">
        <app-toolbar></app-toolbar>
        <router-view></router-view>
    </div>
</template>

<script>
    import { cruiseStore } from './store/cruisestore'
    export default {
        name: 'app',
        provide: {
            cruiseStore
        }
    }
</script>

<style lang="scss" src="./App.scss"></style>
