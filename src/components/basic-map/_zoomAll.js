import {Control} from 'ol/control';

export default function createZoomExtentControl(fnagg = () => {}) {
    var ZoomAllControl = /*@__PURE__*/(function (Control) {
        function ZoomAllControl(opt_options) {
          var options = opt_options || {};
      
          var button = document.createElement('button');
          button.innerHTML = '<i class="icon-undo"></i>';
      
          var element = document.createElement('div');
          element.className = 'map-zoom-all-control ol-unselectable ol-control';
          element.appendChild(button);
      
          Control.call(this, {
            element: element,
            target: options.target
          });
      
          button.addEventListener('click', this.handleZoomAllView.bind(this), false);
        }
      
        if ( Control ) ZoomAllControl.__proto__ = Control;
        ZoomAllControl.prototype = Object.create( Control && Control.prototype );
        ZoomAllControl.prototype.constructor = ZoomAllControl;
      
        ZoomAllControl.prototype.handleZoomAllView = function handleZoomAllView () {
            fnagg();
        };
      
        return ZoomAllControl;
      }(Control));

    return new ZoomAllControl()
}

