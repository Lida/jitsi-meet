import 'aframe';

AFRAME.registerComponent('hand', {
    schema: {
    },
    init: function () { // initialize components to default values
        const childMouseDown =  (evt) => {
            console.log("clicked on a piece!");
            console.log(evt)
        }   
        let self = this;

        this.el.addEventListener('child-attached', function (ev) {
            ev.detail.el.addEventListener('mousedown', childMouseDown)    
            self.recomputeHand();
        })
        this.el.addEventListener('child-detached', function (ev) {
            ev.detail.el.removeEventListener('mousedown', childMouseDown)
            self.recomputeHand();
        })
        for (const el of this.el.children) {
            el.addEventListener('mousedown', childMouseDown)    
        }
    },
    update: function(oldData) {
        this.recomputeHand()
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
