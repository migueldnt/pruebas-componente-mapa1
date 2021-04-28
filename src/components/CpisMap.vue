<template>
    <div class="box">
        <h4 class="title is-4">Mapa de CPIS</h4>
        <dai-basic-map  class="dai-map" :extent="[-118.365119934082,14.5320978164673,-86.7104034423828,32.7186546325684]">
            <dai-xyz-layer  />
            <dai-geojson-layer
                source="capas/estados.geojson"
                :olstyle="estados_style"
                :opacity="0.4"
                :tooltipContent="row=>row.nomgeo"/>
            <dai-geojson-layer
                source="capas/cpis2.geojson"
                :olstyle="cpis_style"
                :tooltipContent="row=>`<strong>${row.descripcio}</strong><br>${row.municipio}, ${row.nomgeo}`"/>
        </dai-basic-map>
        <p class="mt-3">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse aut harum deleniti quas, commodi reprehenderit atque necessitatibus est? Ex, earum. Neque fugiat quam deleniti consectetur ipsam quas ex nobis maxime?</p>
    </div>
    
</template>

<script>
export default {
    data:function(){
        return{
            estados_style:{
                style:{
                    fill:{color:"white"},
                    stroke:{color:"gray",width:1}
                }
            },
            cpis_style:{
                style:{
                    circle:{
                        fill:{color:"#0062ff"},
                        radius:5,
                        stroke:{color:"lightgray",widht:.5}
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
.dai-map{
    height: 500px;
    margin-right: -1.25rem;
    margin-left: -1.25rem;
}

</style>