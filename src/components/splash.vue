<template>
    <div class="splash splash-logo splash-page">
        <div class="splash-content">
            <router-link to="cruiselist">
                <h1 class="splash-movein">OpenCruise</h1>
                <img src="static/images/biltmore.png" alt="Biltmore Stick"/>
            </router-link>
            <p>Tap the Biltmore stick to start.</p>
            <button href="https://github.com/jcrivard/opencruise" class="btn--raised app-button">Source Code</button>
            <button href="https://www.gnu.org/copyleft/gpl.html" class="btn--raised app-button">License Info</button>
            <p style="font-size: .5em">Copyright (C) 2017 James C. Rivard<br/>
                This program is free software and comes with ABSOLUTELY NO WARRANTY.<br/>
                You are welcome to redistribute it under certain conditions.<br/>
                Tap the License Information button above for details.
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'splash'
}
</script>

<style scoped lang="scss">
.splash-content {
    position: relative;
    top: 20vh;
    text-align:center;
}
.splash-page {
    font-size: 2.4rem;
    padding-bottom: 15px;
    background-color: white;
    height:100%;
}
.splash-logo, {
    text-align:center;
    position: absolute;
    width: 100%;
}
.splash-logo a {
    text-decoration: none;
}
.splash-movein {
    margin-bottom: 15px;
    line-height: initial;
    position: relative;
    font-size: 3.00em;
    color:#005100;
    text-shadow: 0 1px 0 #ccc,
               0 2px 0 #c9c9c9,
               0 3px 0 #bbb,
               0 4px 0 #b9b9b9,
               0 5px 0 #aaa,
               0 6px 1px rgba(0,0,0,.1),
               0 0 5px rgba(0,0,0,.1),
               0 1px 3px rgba(0,0,0,.3),
               0 3px 5px rgba(0,0,0,.2),
               0 5px 10px rgba(0,0,0,.25),
               0 10px 10px rgba(0,0,0,.2),
               0 20px 20px rgba(0,0,0,.15);
}
@media (max-device-width: 500px) {
    .splash-page, {
        font-size: 2.0rem;
    }
    .splash-movein {
        font-size: 5.5rem;
    }
    .splash-content {
        top: 5vh;
    }
}
</style>
