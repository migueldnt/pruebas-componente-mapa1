import {Fill, Stroke, Circle, Style} from 'ol/style';

const equivalencias = {
    "fill":{
        class:Fill,
        key:"fill"
    },
    "stroke":{
        class: Stroke,
        key:"stroke"
    },
    "circle":{
        class:Circle,
        key:"image"
    },
    "style":{
        class:Style,
        key:"style"
    }
}

const convertirNode = (key,node)=>{
    let equivalencias_keys=Object.keys(equivalencias)
    let newnode= {}
    //console.log(node)
    Object.keys(node).forEach(subkey=>{
        let subnode = node[subkey]
        let new_subnode = {}
        if( equivalencias_keys.includes( subkey )) {
            new_subnode = convertirNode(subkey,subnode)
        }else{
            new_subnode[subkey] = subnode
        }
        //console.log(subkey,"--> |",new_subnode)
        Object.assign(newnode,new_subnode)
    })
    let conversion = {}
    conversion[equivalencias[key]["key"]] = new equivalencias[key]["class"]( newnode )
    return conversion
}

export default function (serializedStyle){
    //console.log(serializedStyle)
    let style = convertirNode("style",serializedStyle["style"]);
    return style
}

