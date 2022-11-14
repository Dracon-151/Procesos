<template>

    <div class="row">
        <h4>Procesos</h4>
        <div class="col-lg-3 col-md-4 col-sm-6"  v-for="(proceso, index) in procesos" :key="proceso.id">
            <div class="card p-3">
                <div class="row">
                    <div class="col-12">
                        <label>Nombre del Proceso</label>
                        <input :disabled="contador > 0" placeholder="Nombre" class="form-control mb-2" type="text" v-model="proceso.nombre">
                    </div>
                    <div class="col-4">
                        <label>Rafagas</label>
                        <input :disabled="contador > 0" placeholder="0" class="form-control mb-2" type="number" v-model="proceso.rafagas">
                    </div>
                    <div class="col-4">
                        <label>T. llegada</label>
                        <input :disabled="contador > 0" placeholder="0" class="form-control mb-2" type="number" v-model="proceso.llegada">
                    </div>
                    <div class="col-4">
                        <label>Color</label>
                        <input :disabled="contador > 0" type="color" class="form-control mb-2 form-control-color w-100" v-model="proceso.color">
                    </div>
                    <div class="col-12" v-if="contador == 0">
                        <button @click="eliminarProceso(index)" class="mt-2 btn btn-danger w-100">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row" v-if="contador == 0">
        <div class="col-6">
            <button @click="agregarProceso()" class="btn btn-success mb-5 w-100">Agregar proceso +</button>
        </div>
        <div class="col-6">
            <button @click="iniciarAlgoritmo()" class="btn btn-primary mb-5 w-100">Iniciar Algoritmo</button>
        </div>
    </div>
    <template v-if="contador > 0">
        <div class="card p-3" v-if="!finalizado">
            <div class="card-title p-2">
                <h1 class="card-title">Cola de listos</h1>
            </div>
            <div class="row">
                <div class="col-1" v-for="proceso in reversedList" :key="proceso.id">
                    <a class="btn" :style="'background-color: ' + proceso.color">
                        {{proceso.nombre}}
                    </a>
                </div>
            </div>
        </div>
        <div class="card p-3 d-flex">
            <div class="card-title p-2">
                <h1 class="card-title">Diagrama SJN</h1>
            </div>
            <div id="chart">
                <apexchart id="apexChart" type="rangeBar" height="350" :options="chartOptions" :series="computedValues"></apexchart>
            </div>
        </div>
    </template>
    <template v-if="finalizado">
        <div class="card p-3">
            <h3>Tiempos</h3>
            <table class="table table-nowrap">
                <thead>
                    <tr>
                        <th scope="col">Proceso</th>
                        <th scope="col">Finalización</th>
                        <th scope="col">Respuesta</th>
                        <th scope="col">Espera</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="proceso in procesos" :key="proceso.id">
                        <td>{{proceso.nombre}}</td>
                        <td>{{proceso.tf}}</td>
                        <td>{{proceso.tr}}</td>
                        <td>{{proceso.te}}</td>
                    </tr>
                </tbody>
            </table>
            <h3>Promedios</h3>
            <table class="table table-nowrap">
                <thead>
                    <tr>
                        <th scope="col">Finalización</th>
                        <th scope="col">Respuesta</th>
                        <th scope="col">Espera</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{promedios.tf}}</td>
                        <td>{{promedios.tr}}</td>
                        <td>{{promedios.te}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row">
            <div class="col-6">
                <a :href="route('sjn')" class="btn btn-warning mb-5 w-100">Reiniciar datos</a>
            </div>
            <div class="col-6">
                <button @click="imprimir()" class="btn btn-info mb-5 w-100">Generar PDF</button>
            </div>
        </div>
    </template>
</template>

<script>
import { computed, ref } from 'vue'

export default {
    components: {
    },
    props: {
    },
    setup(props){

        const procesos = ref([{
                id: 0,
                nombre: '',
                rafagas: '',
                color: '#e33535',
                llegada: 0,
                tf: 0,
                tr: 0,
                te: 0,
            }]);
        const copia = ref([])
        const listos = ref([])
        const ejecucion = ref(null)
        const rafagas_ejecucion = ref(0)

        const promedios = ref({
            tf: '',
            tr: '',
            te: '',
        });
        const tSimulacion = ref(1);
        const finalizado = ref(false);
        const contador = ref(0);

        const agregarProceso = () => {
            procesos.value.push({
                id: 0,
                nombre: '',
                rafagas: '',
                color: '#e33535',
                llegada: '',
                tf: 0,
                tr: 0,
                te: 0,
            })
        }

        const eliminarProceso = (index) => {
            procesos.value.splice(index,1);
        }

        const iniciarAlgoritmo = () =>{

            procesos.value.forEach((proceso, index) => {
                proceso.id = index;
            });

            copia.value = procesos.value.map((proceso) => {return proceso});

            contador.value = 0;
            finalizado.value = false;
            ejecutar();
        }

        const ejecutar = () => {

            console.log('Vuelta:' + contador.value);
            correrAlgoritmo()
            contador.value++

            if(!finalizado.value) {
                setTimeout(() =>{ 
                    ejecutar()
                }, tSimulacion.value);
            }
            else{
                console.log('fin')
                promedios.value.tf = procesos.value.reduce((total, next) => total + next.tf, 0) / procesos.value.length
                promedios.value.tr = procesos.value.reduce((total, next) => total + next.tr, 0) / procesos.value.length
                promedios.value.te = procesos.value.reduce((total, next) => total + next.te, 0) / procesos.value.length
            }
        }

        const correrAlgoritmo = () =>{

            var copia2 = copia.value.map((proceso) => {return proceso});

            copia.value.forEach((proceso) => {
                if(contador.value >= proceso.llegada){
                    listos.value.push(proceso);
                    var index = copia2.findIndex((x) => x.id === proceso.id);
                    copia2.splice(index, 1);
                }
            });

            copia.value = copia2.map((proceso) => {return proceso});

            listos.value.sort(function (ant, act) {
                if (ant.rafagas < act.rafagas) return -1;
                if (ant.rafagas > act.rafagas) return 1;
                if (ant.llegada < act.llegada) return -1;
                if (ant.llegada > act.llegada) return 1;
            })

            if(ejecucion.value == null && listos.value.length > 0){
                
                ejecucion.value = listos.value[0];
                
                rafagas_ejecucion.value = ejecucion.value.rafagas;

                listos.value.splice(0,1);
            }

            listos.value.forEach((proceso) =>{
                var index = procesos.value.findIndex((x) => x.id === proceso.id);
                procesos.value[index].tr++;
                procesos.value[index].te++;
                
                series.value[0].data.push({
                  x: proceso.nombre,
                  y: [
                    contador.value,
                    contador.value+1
                  ],
                  fillColor: '#000000'
                });
            })

            if(ejecucion.value != null){
                console.log(ejecucion.value.nombre);
                
                series.value[0].data.push({
                  x: ejecucion.value.nombre,
                  y: [
                    contador.value,
                    contador.value+1
                  ],
                  fillColor: ejecucion.value.color
                });

                var index = procesos.value.findIndex((x) => x.id === ejecucion.value.id);
                
                
                procesos.value[index].tr++;
                rafagas_ejecucion.value--;


                if(rafagas_ejecucion.value < 1){
                    procesos.value[index].tf = contador.value+1;
                    ejecucion.value = null;
                }
            }

            if(listos.value.length < 1 && copia.value.length < 1 && ejecucion.value == null){
                finalizado.value = true;
            }
        }

        const imprimir = () =>{
            window.print();
        }


        const series = ref([
            {
              data: [
              ]
            }
        ])

        const computedValues = computed(() =>{return series.value})
        const reversedList = computed(() =>{return listos.value.map((proceso) => 
            {return proceso}).reverse()})

        const chartOptions = {
            chart: {
              height: 350,
              type: 'rangeBar',
              animations: {
                enabled: false,
              }
            },
            plotOptions: {
              bar: {
                horizontal: true,
                distributed: true,
                dataLabels: {
                  hideOverflowingLabels: false
                }
              }
            },
            xaxis: {
              type: 'numeric'
            },
            dataLabels: {
              enabled: true,
              formatter: function(val, opts) {
                return opts.globals.seriesX[0][opts.dataPointIndex];
              },
              style: {
                colors: ['#f3f4f5', '#fff']
              }
            },
            grid: {
              row: {
                colors: ['#f3f4f5', '#fff'],
                opacity: 1
              }
            }
        }

        return{
            series,
            computedValues,
            reversedList,
            chartOptions,
            procesos,
            promedios,
            copia,
            listos,
            ejecucion,
            rafagas_ejecucion,
            agregarProceso,
            eliminarProceso,
            ejecutar,
            iniciarAlgoritmo,
            correrAlgoritmo,
            imprimir,
            tSimulacion,
            contador,
            finalizado,
        }
    }
}
</script>

<style scoped>

</style>
