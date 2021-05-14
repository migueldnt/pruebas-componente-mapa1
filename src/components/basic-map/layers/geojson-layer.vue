<script>
import defaultProps from "./_defaultLayerProps"
import defaultData from "./_defaultLayerData";
import defaultWatchers from "./_defaultLayerWatchers";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import generateOlStyle from "./_json2olstyle"
export default {
    props:{
        ...defaultProps,
        source:{
            type:[String,Object],
            default:"",
            required:true
        },
        tooltipContent:{
            type:[Function,String],
            default:"none"
        },
        popupContent:{
            type:[Function,String],
            default:"none"
        },
        olstyle:{
            type:[Function,Object],
            default: function(){
                return {} //deefinir un estilo global por default
            }
        },
        movibleTooltip:{
            type:Boolean,
            default:false
        },
        _clicks:{
            type:Number,
            default:0
        },
        tooltipTop:{
            type:Number,
            default:0
        }
    },
    data:function(){
        return{
            ...defaultData,
        }
    },
    created:function(){
        let vm = this;
        this.layer_register(this.id,this)
        vm.$parent.getMap(function(map){
            let style;
            if(typeof vm.olstyle == "function"){
                style= function(feature){
                    let serializes= vm.olstyle(feature)
                    serializes = feature.get("_hightlight") == true ? serializedStyleIfHighlight(serializes): serializes ;
                    let olstyles=generateOlStyle(serializes)["style"]
                    return olstyles
                }
            }else{
                style = function(feature){
                    let serializes= vm.olstyle
                    serializes = feature.get("_hightlight") ==true ? serializedStyleIfHighlight(serializes): serializes ;
                    let olstyles=generateOlStyle(serializes)["style"]
                    return olstyles
                }
            }
            
            let vectorSource = typeof vm.source == "object" 
                ? new VectorSource({features: new GeoJSON().readFeatures(vm.source),})
                : new VectorSource({url: vm.source,format: new GeoJSON()})

            let layer = new VectorLayer({
                source: vectorSource,
                visible:vm.visible,
                style:style,
                opacity: vm.opacity,
                zIndex: vm.zIndex
            })
            
            layer.set("id",vm.id)
            if(vm.tooltipContent!="none"){
                
                layer.set("_tooltip",vm.tooltipContent)
                layer.set("_tooltip_mov",vm.movibleTooltip)
                layer.set("_tooltip_top",vm.tooltipTop)
                
            }

            if(vm.popupContent!="none"){
                
                layer.set("_popup",vm.popupContent)
            }

            map.addLayer(layer)
            vm.olLayer = layer;
        })
    },
    watch:{
        ...defaultWatchers,
        "tooltipContent":function(nValue){
            if(this.olLayer){
                if(nValue!="none"){
                    
                    this.olLayer.set("_tooltip",nValue)
                    this.olLayer.set("_tooltip_mov",this.movibleTooltip)
                    this.olLayer.set("_tooltip_top",this.tooltipTop)
                    
                }else{
                    this.olLayer.set("_tooltip",undefined)
                    this.olLayer.set("_tooltip_mov",undefined)
                    this.olLayer.set("_tooltip_top",undefined)
                }
            }
            
        }
    },
    methods:{
    },
    render:function(){
        return null
    },
    model:{
        event:"click_feature",
        prop: "_clicks"
    },
    inject:["layer_register"]
}


const serializedStyleIfHighlight=function(serializedStyle){
    let serialized2= JSON.parse(JSON.stringify(serializedStyle))
    if("stroke" in serialized2["style"]){
        serialized2["style"]["stroke"]["color"] = "gray"
        serialized2["style"]["stroke"]["width"] = 3
        serialized2["style"]["zIndex"] = 2;
    } 
    //console.log(serializedStyle,serialized2)
    return serialized2
}

</script>