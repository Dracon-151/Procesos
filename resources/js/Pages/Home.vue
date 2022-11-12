<template>
    <div class="card">
        <div class="card-body">
            <div class="d-flex position-relative">
                <img :src="getPhoto()" class="flex-shrink-0 me-3 avatar-xl rounded" alt="...">
                <div>
                    <h4 class="mt-0">Proyecto Final de la materia Sistemas Operativos</h4>
                    <p>Desarrollado por Demian Alexis Alvarado Palacios<br>
                    <span class="text-muted">Ingeniería en Desarrollo de Software 7mo Semestre TM</span></p>
                    <h5 class="mt-3">Seleccione un algoritmo para comenzar</h5>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        
    },
    setup(props){

        const getPhoto = () =>{
            return 'assets/images/users/me.png'
        }
        
        return{
            getPhoto
        }
    }
}
</script>

<style scoped>

</style>
