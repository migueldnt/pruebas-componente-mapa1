<template>
    <div class="embed">
        
        
            
    
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
                :tooltipContent="row=>`<strong>${row.nomgeo}</strong> <br> CPI: ${row.count_cpis}<br>Laboratorios Nacionales: ${row.count_lab_nal}`"
                />
            <dai-xyz-layer :visible="xyz_visible" :opacity="1" xyz-url="https://{a-c}.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}.png"/>
            <dai-geojson-layer
                id="cpis"
                :source="cpisLayer"
                :olstyle="cpis_style"
                @click_feature="acercamiento_cpi"
                :tooltipTop="-6"
                :visible="visible_cpis"
                :tooltipContent="popupCpis"/>

            <dai-geojson-layer id="laboratorios"
                :source="laboratoriosLayer"
                :olstyle="labsStyle"
                :tooltipContent="popupLabs"
                @click_feature="acercamiento_cpi"
                :visible="visible_labs"
                :tooltipTop="2"
                />
            <button class="button-alterna-calles" :class="{'active':xyz_visible}" @click="xyz_visible=!xyz_visible">Ver mapa de calles</button>
            <div class="leyenda">
                <div class="item-leyenda" 
                    :class="{'active':visible_cpis}"
                    @click="visible_cpis =!visible_cpis">
                    <span class="icon-pin"></span> Centros Públicos de Investigación
                </div>
                <div class="item-leyenda" 
                    :class="{'active':visible_labs}"
                    @click="visible_labs =!visible_labs">
                    <i class="icon-circle"></i> Laboratorios Nacionales
                </div>
            </div>
        </dai-basic-map>
        
            
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
            visible_cpis:true,
            visible_labs:true,
            popupCpis:(row)=>{
                //preparar la direccion 
                let nuevaDireccion = formatoDireccion(row.direccion)
                let telefono = formatPhoneNumber(row.tel_oficin);
                let pagina = `<a target="_blank" href="${row.pagina}">${truncate(row.pagina,32)}</a>`;
                this.cpiHoverActual=row.oid
                return `<div><img src="logos/${row.logo}" class="icon-cpi"></div><strong>${row.descripcio}</strong><br>${nuevaDireccion}<br>Telefono: ${telefono}<br>${pagina}`
            },
            popupLabs:row=>{
                let logo = row.logos == "Sin Logo" ? '' :`<div><img src="logos/laboratorios/${row.logos}" class="icon-cpi"></div>`
                let pagina = row.pagina ?`<a target="_blank" href="${row.pagina}">${truncate(row.pagina,32)}</a>` : '';
                let siglas= row.siglas ? `${row.siglas}, ` : ''
                let instituciones_aso = row.instit_aso ? `<br>${row.instit_aso}` : '' ;
                return `${logo}<strong style="white-space:normal">${row.nom_lab_na}</strong><br> ${siglas} ${row.instit_res}<br>Instituciones asociadas: ${row.numero_ins} ${instituciones_aso} <br> ${pagina}`
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
                        //scale:.4,
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
.embed{
    height: 100%;
    width: 100%;
    background-color: #032663;
}
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
.leyenda{
    position: absolute;
    top: .5rem;
    right: .5rem;
    background-color: #0062FF;
    padding: .3rem;
    border-radius: 5px;
    .item-leyenda{
        font-size: 13px;
        color: #bcbbbb;
        cursor:pointer;
        -webkit-user-select: none; /* Safari */        
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
        &.active{
            color: white;
        }
        .icon-pin:before{
            content:'';
            width: 18px;
            height: 18px;
            background-image: url(/logos/puntero-mapa.svg) ;
            top: 4px;
            left: 0px;
            display: inline-block;
            background-size: cover;
            position: relative;
        }
        .icon-circle:before{
            content:'';
            width: 11px;
            height: 11px;
            background-color: white;
            top: 2px;
            left: 4px;
            margin-right: 6px;
            display: inline-block;
            //background-size: cover;
            position: relative;
            border-radius: 50%;
        }
    }
}
</style>
<style>
.icon-cpi{
    height: 30px;
    width: auto;
}
</style>