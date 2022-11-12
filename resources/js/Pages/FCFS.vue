<template>
    <template v-if="!finalizado">
        <div class="row">
            <div class="col-12">
                <div class="card p-3">
                    <label>Tiempo de simulación</label>
                    <input min="5" max="3000" placeholder="0" class="form-control mb-2" type="number" v-model="tSimulacion">
                </div>        
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6"  v-for="(proceso, index) in procesos" :key="proceso.id">
                <div class="card p-3">
                    <div class="row">
                        <div class="col-12">
                            <label>Nombre del Proceso</label>
                            <input placeholder="Nombre" class="form-control mb-2" type="text" v-model="proceso.nombre">
                        </div>
                        <div class="col-4">
                            <label>Rafagas</label>
                            <input placeholder="0" class="form-control mb-2" type="number" v-model="proceso.rafagas">
                        </div>
                        <div class="col-4">
                            <label>T. llegada</label>
                            <input placeholder="0" class="form-control mb-2" type="number" v-model="proceso.llegada">
                        </div>
                        <div class="col-4">
                            <label>Color</label>
                            <input type="color" class="form-control mb-2 form-control-color w-100" v-model="proceso.color">
                        </div>
                        <div class="col-12">
                            <button @click="eliminarProceso(index)" class="mt-2 btn btn-danger w-100">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <button @click="agregarProceso()" class="btn btn-success mb-5 w-100">Agregar proceso +</button>
            </div>
            <div class="col-6">
                <button @click="iniciarAlgoritmo()" class="btn btn-primary mb-5 w-100">Iniciar Algoritmo</button>
            </div>
        </div>
    </template>
    <div class="card p-3">
        <div class="card-title p-2">
            <h1 class="card-title">Diagrama de procesos</h1>
        </div>
        <div id="chart">
            <apexchart type="rangeBar" height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
    </div>
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
                <a :href="route('fcfs')" class="btn btn-warning mb-5 w-100">Reiniciar datos</a>
            </div>
            <div class="col-6">
                <button @click="iniciarAlgoritmo()" class="btn btn-info mb-5 w-100">Generar PDF</button>
            </div>
        </div>
    </template>
</template>

<script>
import { ref } from 'vue'

export default {
    components: {
    },
    props: {
        
    },
    setup(props){

        const procesos = ref([{
                nombre: '',
                rafagas: '',
                color: '#000000',
                llegada: '',
                tf: '',
                tr: '',
                te: '',
            }]);
        const promedios = ref({
            tf: '',
            tr: '',
            te: '',
        });
        const tSimulacion = ref(5);
        const finalizado = ref(false);
        const contador = ref(0);

        const agregarProceso = () => {
            procesos.value.push({
                nombre: '',
                rafagas: '',
                color: '#000000',
                llegada: '',
                tf: '',
                tr: '',
                te: '',
            })
        }

        const eliminarProceso = (index) => {
            procesos.value.splice(index,1);
        }

        const iniciarAlgoritmo = () =>{
            contador.value = 0;
            finalizado.value = false;
            ejecutar();
        }

        const ejecutar = () => {

            console.log("Hola");
            contador.value++
            agregarProceso()

            if(contador.value < 4) {
                setTimeout(() =>{ 
                    ejecutar()
                }, tSimulacion.value);
            }
            else{
                finalizado.value = true
                console.log(finalizado)
            }
        }

        const series = [
            {
              data: [
                {
                  x: 'A',
                  y: [
                    1,
                    2
                  ],
                  fillColor: '#008FFB'
                },
                {
                  x: 'A',
                  y: [
                    2,
                    3
                  ],
                  fillColor: '#008FFB'
                },
                {
                  x: 'B',
                  y: [
                    25,
                    26
                  ],
                  fillColor: '#ACDEDA'
                },
              ]
            }
        ]
        
        const chartOptions = {
            chart: {
              height: 350,
              type: 'rangeBar'
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
            chartOptions,
            procesos,
            promedios,
            agregarProceso,
            eliminarProceso,
            ejecutar,
            iniciarAlgoritmo,
            tSimulacion,
            contador,
            finalizado,
        }
    }
}
</script>

<style scoped>

</style>
