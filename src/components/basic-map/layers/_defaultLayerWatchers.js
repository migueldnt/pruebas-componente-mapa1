export default {
    visible: function(newValue){
        this.olLayer.setVisible(newValue)
    },
    opacity: function(newValue){
        this.olLayer.setOpacity(newValue)
    },
    zIndex:function(newValue){
        this.olLayer.setZIndex(newValue)
    }
}