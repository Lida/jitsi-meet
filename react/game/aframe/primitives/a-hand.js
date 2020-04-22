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
            this.draggingEl = null;
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
            el.setAttribute('position', {x: i * 0.4 - this.el.children.length * 0.4 / 2, y: Math.abs(i - this.el.children.length / 2) * -.06+ 0.15, z: i * 0.005})
            el.setAttribute('rotation', {x: 0, y: 0, z: (i - this.el.children.length / 2) * -4})
        }
    }
})

AFRAME.registerPrimitive('a-hand', {
    defaultComponents: {
        hand: {},
    },
    mappings: {}
});
