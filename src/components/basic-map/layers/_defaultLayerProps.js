export default {
    id:{
        type: String,
        default: Math.random().toString(36).substring(7)
    },
    visible:{
        type:Boolean,
        default:true
    },
    zIndex:{
        type:Number,
        default:undefined
    },
    opacity:{
        type:Number,
        default:1
    }
}