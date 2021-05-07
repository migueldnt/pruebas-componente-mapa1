<template>
    <div class="custom-box">
        <div class="description">
            <h4 class="title is-4">Centros Públicos de Investigación</h4>
            <p > Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo vel laboriosam totam sunt ex error. Eveniet nihil nostrum doloremque esse ut accusamus excepturi optio, nulla incidunt explicabo illo quibusdam in.</p>
        </div>
        <dai-basic-map  class="dai-map" :maxZoom="18" 
            @resetView="resetMap"
            :extent="[-118.365119934082,14.5320978164673,-86.7104034423828,33.7186546325684]">
            <dai-xyz-layer :visible="xyz_visible" :opacity="1" xyz-url="https://{a-c}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png"/>
            <dai-geojson-layer
                id="estados"
                :source="estadosLayer"
                :olstyle="estados_style"
                :opacity="1"
                :movible-tooltip="true"
                @click_feature="acercamiento_edo"
                :tooltipContent="row=>`<strong>${row.nomgeo}</strong> <br> Cantidad de centros: ${row.count_cpis}<br>Cantidad de laboratorios: ${row.count_lab_nal}`"
                />
            <dai-xyz-layer :visible="xyz_visible" :opacity="1" xyz-url="https://{a-c}.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}.png"/>
            <dai-geojson-layer
                id="cpis"
                :source="cpisLayer"
                :olstyle="cpis_style"
                @click_feature="acercamiento_cpi"
                :tooltipTop="-6"
                :tooltipContent="popupCpis"/>

            <dai-geojson-layer id="laboratorios"
                :source="laboratoriosLayer"
                :olstyle="labsStyle"
                :tooltipContent="popupLabs"
                @click_feature="acercamiento_cpi"
                :tooltipTop="1"
                />
            <button class="button-alterna-calles" :class="{'active':xyz_visible}" @click="xyz_visible=!xyz_visible">Ver mapa de calles</button>
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
import DaiXyzLayer from "./basic-map/layers/xyz-layer"
import estados from "../assets/capas/estados.json"
import cpis from "../assets/capas/cpi_30abril21.json"
import laboratorios from "../assets/capas/laboratorios.json"

//laboratorios["features"] = laboratorios["features"].filter(feature=>feature.properties.estatus == "Activo")

export default {
    components:{
        DaiBasicMap,DaiGeojsonLayer,DaiXyzLayer
    },
    data:function(){
        return{
            estadosLayer:estados,
            cpisLayer:cpis,
            laboratoriosLayer : laboratorios,
            xyz_visible:false,
            cpiHoverActual:null,
            popupCpis:(row)=>{
                //preparar la direccion 
                let nuevaDireccion = formatoDireccion(row.direccion)
                let telefono = formatPhoneNumber(row.tel_oficin);
                let pagina = `<a target="_blank" href="${row.pagina}">${truncate(row.pagina,32)}</a>`;
                this.cpiHoverActual=row.oid
                return `<div><img src="logos/${row.logo}" class="icon-cpi"></div><strong>${row.descripcio}</strong><br>${nuevaDireccion}<br>Telefono: ${telefono}<br>${pagina}`
            },
            popupLabs:row=>{
                let pagina = row.pagina ?`<a target="_blank" href="${row.pagina}">${truncate(row.pagina,32)}</a>` : '';
                let siglas= row.siglas ? `${row.siglas}, ` : ''
                return `<strong style="white-space:normal">${row.nom_lab_nal}</strong><br> ${siglas} ${row.instit_responsable}<br>Instituciones asociadas: ${row.numero_instituc_asociadas}<br> ${row.instit_asociadas}<br> ${pagina}`
            },
            estados_style:{
                style:{
                    fill:{color:"#ffffff00"},
                    stroke:{color:"white",width:1}
                }
            },
            cpis_style:{
                style:{
                    icon:{
                        anchor:[.5,0],
                        anchorOrigin: "bottom-left",
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: 'logos/puntero-mapa.svg',
                        scale:.4,
                        offset: [0,0],
                        //size: [40,40]
                    }
                    
                }
            },
            labsStyle:{
                style:{
                    circle:{
                        radius: 6,
                        stroke:{
                            color:"gray",
                            width: 1
                        },
                        fill:{
                            color:"white"
                        }
                    }
                }
            }
        }
    },
    methods:{
        acercamiento_cpi:function(){
            this.xyz_visible = true;
            //console.log("se acerco al cpi")
        },
        acercamiento_edo:function(){
            this.xyz_visible = false;
            //console.log("se acerco al estado")
        },
        resetMap:function(){
            this.xyz_visible = false;
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

.button-alterna-calles{
    position: absolute;
    left: .5rem;
    bottom: .5rem;
    background-color: #0062FF;
    color: white;
    border-color:white;
    border-width: 1px;
    border-style: hidden;
    border-radius: 3px;
    cursor: pointer;
    &.active{
        border-style: solid;
    }
}
</style>
<style>
.icon-cpi{
    height: 30px;
    width: auto;
}
</style>