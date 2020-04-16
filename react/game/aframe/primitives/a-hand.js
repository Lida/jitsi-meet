import 'aframe';

AFRAME.registerComponent('hand', {
    schema: {
    },
    init: function () {
        if (this.el.sceneEl.hasLoaded) {
            this._init();
        } else {
            this.el.sceneEl.addEventListener('loaded', this._init.bind(this));
        }        
    },
    _init: function () { // initialize components to default values
        let self = this;
        this.raycaster = this.el.sceneEl.components.raycaster;

        const childMouseDown =  (evt) => {
            console.log("clicked on piece in hand!");
            console.log(evt);
            self.draggingEl = evt.target;
            self.draggingEl.object3D.updateMatrix();
            self.draggingEl.object3D.updateMatrixWorld();
            self.draggingEl.sceneEl.object3D.attach(self.draggingEl.object3D);
        }   

        const childMouseUp =  (evt) => {
            console.log("released piece in hand!");
            console.log(evt);
            // reflect certain components for performance, see https://aframe.io/docs/1.0.0/introduction/javascript-events-dom-apis.html#updating-position-rotation-scale-visible
            self.draggingEl.object3D.updateMatrix();
            self.draggingEl.object3D.updateMatrixWorld();
            self.draggingEl.setAttribute('position', self.draggingEl.getAttribute('position'));
            self.draggingEl.setAttribute('rotation', self.draggingEl.getAttribute('rotation'));
            self.draggingEl.flushToDOM(true);
            let copy = self.draggingEl.cloneNode();            
            self.el.sceneEl.appendChild(copy);
            self.el.removeChild(self.draggingEl);
            self.draggingEl = null;
            this.recomputeHand();
        }   


        this.el.addEventListener('child-attached', function (ev) {
            ev.detail.el.addEventListener('mousedown', childMouseDown)    
            ev.detail.el.addEventListener('mouseup', childMouseUp)
            self.recomputeHand();
        })
        this.el.addEventListener('child-detached', function (ev) {
            ev.detail.el.removeEventListener('mousedown', childMouseDown)
            ev.detail.el.addEventListener('mouseup', childMouseUp)
            self.recomputeHand();
        })
        for (const el of this.el.children) {
            el.addEventListener('mousedown', childMouseDown)    
            el.addEventListener('mouseup', childMouseUp)
        }
    },
    update: function(oldData) {
        this.recomputeHand();
    },
    recomputeHand() {
        for (let i = 0; i < this.el.children.length; i++) {
            const el = this.el.children[i]
            el.setAttribute('position', {x: i * 0.4, y: 0, z: i * 0.001})
        }
    }
})

AFRAME.registerPrimitive('a-hand', {
    defaultComponents: {
        hand: {},
    },
    mappings: {}
});
