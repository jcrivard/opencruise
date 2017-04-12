import Vue from 'vue'
import Router from 'vue-router'
import SplashComponent from '@/components/splash'
import CruiseListComponent from '@/components/cruiselist'
import CruiseComponent from '@/components/cruise/cruise'
import PlotComponent from '@/components/cruise/plot'
import ConfigComponent from '@/components/config'
import HelpComponent from '@/components/help'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', name: 'splash', component: SplashComponent },
        { path: '/config', name: 'config', component: ConfigComponent },
        { path: '/help', name: 'help', component: HelpComponent },
        { path: '/cruiselist', name: 'cruiselist', component: CruiseListComponent },
        { path: '/cruise/:cruiseid', name: 'cruise', component: CruiseComponent, props: true },
        { path: '/cruise/:cruiseid/plot/:plotnum', name: 'plot', component: PlotComponent, props: true }
    ]
})
