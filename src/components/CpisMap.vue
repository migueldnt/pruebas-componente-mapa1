<template>
    <div class="custom-box">
        <div class="description">
            <h4 class="title is-4">Centros Públicos de Investigación</h4>
            <p > Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo vel laboriosam totam sunt ex error. Eveniet nihil nostrum doloremque esse ut accusamus excepturi optio, nulla incidunt explicabo illo quibusdam in.</p>
        </div>
        <dai-basic-map  class="dai-map" :maxZoom="18" :extent="[-118.365119934082,14.5320978164673,-86.7104034423828,32.7186546325684]">
            
            <dai-geojson-layer
                :source="estadosLayer"
                :olstyle="estados_style"
                :opacity="1"
                />
            <dai-geojson-layer
                :source="cpisLayer"
                :olstyle="cpis_style"
                
                :tooltipContent="popupCpis"/>
        </dai-basic-map>
        
            <a href="#" class="footer-button">
                <span>Centros Públicos de Investigación</span>
                <div class="arrow-container">
                    <div class="arrow"></div>
                </div>
                
            </a>
        
    </div>
    
</template>

<script>
import DaiBasicMap from "./basic-map/basic-map"
import DaiGeojsonLayer from "./basic-map/layers/geojson-layer"
import estados from "../assets/capas/estados.json"
import cpis from "../assets/capas/cpi_30abril21.json"

export default {
    components:{
        DaiBasicMap,DaiGeojsonLayer
    },
    data:function(){
        return{
            estadosLayer:estados,
            cpisLayer:cpis,
            popupCpis:(row)=>{
                //preparar la direccion 
                let nuevaDireccion = formatoDireccion(row.direccion)
                let telefono = formatPhoneNumber(row.tel_oficin);
                let pagina = `<a target="_blank" href="${row.pagina}">${truncate(row.pagina,32)}</a>`;
                return `<strong>${row.descripcio}</strong><br>${nuevaDireccion}<br>Telefono: ${telefono}<br>${pagina}`
            },
            estados_style:{
                style:{
                    fill:{color:"#032663"},
                    stroke:{color:"white",width:1}
                }
            },
            cpis_style:{
                style:{
                    circle:{
                        fill:{color:"white"},
                        radius:5,
                        stroke:{color:"white",widht:.5}
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

function truncate(str, n){
  return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
}
</script>

<style lang="scss" scoped>

.custom-box{
    background-color: #032663;
    border-radius: 16px;
    .description{
        padding: 2rem 4rem;
        color: white;
        h4{
            color:white 
        }
        
    }
    .footer-button{
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
    }
}

.dai-map{
    height: 500px;
    border-top: .5px solid white;
    border-bottom: .5px solid white;
}
.arrow-container{
    padding-top: .7rem;
}
.arrow {
  background: #fff;
  height: 3px;
  width: 30px;
  margin: 0 auto;
  position: relative;
  cursor: pointer;

  &:before,
  &:after {
    content: "";
    background: #fff;
    position: absolute;
    height: 3px;
    width: 15px;
  }

  &:before {
    right: -3px;
    bottom: -4px;
    transform: rotate(-45deg);
  }

  &:after {
    right: -3px;
    top: -4px;
    transform: rotate(45deg);
  }
}
</style>