<template>
    <div class="custom-box">
        <div class="description">
            <h4 class="title is-4">Centros Públicos de Investigación y Laboratorios Nacionales</h4>
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
                :tooltipContent="newPopupEstados"
                />
            <dai-xyz-layer :visible="xyz_visible" :opacity="1" xyz-url="https://{a-c}.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}.png"/>
            <dai-geojson-layer
                id="cpis"
                :source="cpisLayer"
                :olstyle="cpis_style"
                @click_feature="acercamiento_cpi"
                :tooltipTop="-6"
                :visible="visible_cpis"
                :tooltipContent="newPopupCpis"/>

            <dai-geojson-layer id="laboratorios"
                :source="laboratoriosLayer"
                :olstyle="labsStyle"
                :tooltipContent="newPopupLabs"
                @click_feature="acercamiento_cpi"
                :visible="visible_labs"
                :tooltipTop="-6"
                />
            
            
            <div class="leyenda">
                <label class="item-leyenda cpis" >
                    <input type="checkbox" v-model="visible_cpis">
                    <span class="checkmark"></span> 
                    <p>
                        <span class="icon-pin"></span> 
                        Centros Públicos de Investigación
                        
                        <a href="descargas/centros_publicos_investigacion.zip" download><span class="dai-icon dai-icon-download"></span></a>
                    </p>
                </label>
                <label class="item-leyenda labs" >
                    <input type="checkbox" v-model="visible_labs">
                    <span class="checkmark"></span> 
                    <p>
                        <i class="icon-pin2"></i> 
                        Laboratorios Nacionales
                        
                        <a href="descargas/laboratorios_nacionales.zip" download><span class="dai-icon dai-icon-download"></span></a>
                    </p>
                </label>
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
            newPopupCpis:"none",
            popupLabs:row=>{
                let logo = row.logos == "Sin Logo" ? '' :`<div><img src="logos/laboratorios/${row.logos}" class="icon-cpi"></div>`
                let pagina = row.pagina ?`<a target="_blank" href="${row.pagina}">${truncate(row.pagina,32)}</a>` : '';
                let siglas= row.siglas ? `${row.siglas}, ` : ''
                let instituciones_aso = row.instit_aso ? `<br><span style="white-space:normal">${row.instit_aso}</span>` : '' ;
                return `${logo}<strong style="white-space:normal">${row.nom_lab_na}</strong><br> ${siglas} ${row.instit_res}<br>Instituciones asociadas: ${row.numero_ins} ${instituciones_aso} <br> ${pagina}`
            },
            newPopupLabs:"none",
            popupEstados:row=>`<strong>${row.nomgeo}</strong> <br> CPI: ${row.count_cpis}<br>Laboratorios Nacionales: ${row.count_lab_nal}`,
            newPopupEstados:"none",
            estados_style:{
                style:{
                    fill:{color:"#ffffff00"},
                    stroke:{color:"gray",width:1}
                }
            },
            cpis_style:{
                style:{
                    icon:{
                        anchor:[.5,0],
                        anchorOrigin: "bottom-left",
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: 'logos/puntero-mapa1.svg',
                        //scale:.4,
                        offset: [0,0],
                        //size: [40,40]
                    }
                    
                }
            },
            labsStyle:{
                style:{
                    icon:{
                        anchor:[.5,0],
                        anchorOrigin: "bottom-left",
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: 'logos/puntero-mapa2.svg',
                        //scale:.4,
                        offset: [0,0],
                        //size: [40,40]
                    }
                    
                }
            }
        }
    },
    methods:{
        acercamiento_cpi:function(){
            this.xyz_visible = true;
            this.newPopupEstados = "none";
            //console.log("se acerco al cpi")
        },
        acercamiento_edo:function(){
            this.xyz_visible = true;
            this.newPopupEstados = "none"; //this.popupEstados
            //console.log("se acerco al estado")
        },
        resetMap:function(){
            this.xyz_visible = false;
            this.newPopupEstados = this.popupEstados
        }
    },
    mounted:function(){
        this.newPopupCpis=this.popupCpis;
        this.newPopupLabs= this.popupLabs;
        this.newPopupEstados = this.popupEstados
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
    background-color: white;
    border-radius: 16px;
    border: 1px solid #032663;
    .description{
        padding: 2rem 4rem;
        color: #002663;
        h4{
            color: #002663;
        }
        
        
    }
    .footer-button{
        //color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
    }
}

.dai-map{
    height: 500px;
    border-top: .5px solid #032663;
    //border-bottom: .5px solid #032663;
    margin-bottom: 8px;
    .ol-layer>canvas{
        border-radius: 0 0 6px 6px;
    }
}

.button-alterna-calles{
    position: absolute;
    left: .5rem;
    bottom: .5rem;
    background-color: #032663;
    color: white;
    border-color:white;
    border-width: 1px;
    border-style: hidden;
    border-radius: 3px;
    cursor: pointer;
    padding: .5rem 2px;
    &.active{
        border-style: solid;
    }
}
.leyenda{
    //position: absolute;
    top: .5rem;
    right: .5rem;
    //background-color: #0062FF;
    padding: 1rem;
    border-bottom: 1px solid #032663;

    @media (min-width: 769px) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0; //0 0 2rem;
    }
    .item-leyenda{
        display: block;
        position: relative;

        font-size: 15px;
        color: black;
        cursor:pointer;
        padding-left: 30px;
        margin-bottom: 5px;

        @media (min-width: 769px) {
            margin:0;
            padding-top: .5rem;
            padding-bottom: .5rem;
            padding-left: calc(30px + 2rem);
            flex-grow: 1;
        }
        a{
            color: inherit;
            &:hover{
                text-shadow: 3px 0px 4px #a7a7a7;
            }
        }
        input{
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
            &:checked~.checkmark {
                background-color: #032663;
            }
        }
        

        .checkmark{ 
                position: absolute;
                top: 5px;
                left: 0;
                height: 24px;
                width: 24px;
                background-color: #fff;
                @media (min-width: 769px) {
                    top: calc(.5rem + 5px);
                    left:2rem
                }
                
                &:after {
                    content: "";
                    position: absolute;
                    display: none;
                    left: 5px;
                    top: 1px;
                    width: 8px;
                    height: 13px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    -webkit-transform: rotate(45deg);
                    -ms-transform: rotate(45deg);
                    transform: rotate(45deg);
                }
        }
        
        & input:checked~.checkmark:after {
            display: block;
        }

       &.labs{
           color:#9F2241;
           .checkmark{
               border: 3px solid #9F2241;
           }
           &:hover input~.checkmark {
                background-color: #9f2241af;
            }
            input{
                &:checked~.checkmark {
                    background-color: #9F2241;
                }
            }
            @media (min-width: 769px) {
                border-left: 1px solid #032663;
            }
       }
       &.cpis{
           color:#414141;
           .checkmark{
               border: 3px solid #414141;
           }
           &:hover input~.checkmark {
                background-color: #414141a4;
            }
            input{
                &:checked~.checkmark {
                    background-color: #414141;
                }
            }
       }
        .icon-pin:before{
            content:'';
            width: 22px;
            height: 22px;
            background-image: url(/logos/puntero-mapa1.svg) ;
            top: 5px;
            left: 0px;
            display: inline-block;
            background-size: cover;
            position: relative;
        }
        .icon-pin2:before{
            content:'';
            width: 22px;
            height: 22px;
            background-image: url(/logos/puntero-mapa2.svg) ;
            top: 5px;
            left: 0px;
            display: inline-block;
            background-size: cover;
            position: relative;
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