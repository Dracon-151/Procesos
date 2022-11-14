import './bootstrap';
import { createApp } from "vue/dist/vue.esm-bundler";
import VueApexCharts from "vue3-apexcharts";

import HomePage from '@/Pages/Home.vue'
import FcfsPage from '@/Pages/FCFS.vue'
import SjnPage from '@/Pages/SJN.vue'

const app = createApp({
    components: {
        HomePage,
        FcfsPage,
        SjnPage,
    },
});
app.mixin(
    {
        methods:{
            route,
        }
    }
);
app.use(VueApexCharts);

app.mount("#app");