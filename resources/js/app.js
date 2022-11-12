import './bootstrap';
import { createApp } from "vue/dist/vue.esm-bundler";
import VueApexCharts from "vue3-apexcharts";

import HomePage from '@/Pages/Home.vue'
import FcfsPage from '@/Pages/FCFS.vue'

const app = createApp({
    components: {
        FcfsPage,
        HomePage
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