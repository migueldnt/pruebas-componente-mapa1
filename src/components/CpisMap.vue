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
                source="capas/cpi_30abril21.geojson"
                :olstyle="cpis_style"
                :tooltipContent="row=>`<strong>${row.descripcio}</strong>`"
                :popupContent="popupCpis"/>
        </dai-basic-map>
        <p class="mt-3">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse aut harum deleniti quas, commodi reprehenderit atque necessitatibus est? Ex, earum. Neque fugiat quam deleniti consectetur ipsam quas ex nobis maxime?</p>
    </div>
    
</template>

<script>
export default {
    data:function(){
        return{
            popupCpis:(row)=>{
                //preparar la direccion 
                let nuevaDireccion = formatoDireccion(row.direccion)
                let telefono = formatPhoneNumber(row.tel_oficin);
                let pagina = `<a target="_blank" href="${row.pagina}">${row.pagina}</a>`;
                return `<strong>${row.descripcio}</strong><br>${nuevaDireccion}<br>Telefono: ${telefono}<br>${pagina}`
            },
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

function formatoDireccion(direccion){
    let nuevaDireccion=direccion
    let numeroDeSegundaComa = nuevaDireccion.split(",").length == 7 ? 5 : 4;
    let posSalto1 = (nuevaDireccion.split(",",2).join(",").length) + 1;
    nuevaDireccion = [nuevaDireccion.slice(0,posSalto1),'<br>',nuevaDireccion.slice(posSalto1)].join("");
    let posSalto2 = (nuevaDireccion.split(",",numeroDeSegundaComa).join(",").length) + 1;
    nuevaDireccion = [nuevaDireccion.slice(0,posSalto2),'<br>',nuevaDireccion.slice(posSalto2)].join("");
    return nuevaDireccion
}
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}
</script>

<style scoped>
.dai-map{
    height: 500px;
    margin-right: -1.25rem;
    margin-left: -1.25rem;
}

</style>