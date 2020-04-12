import 'aframe';

AFRAME.registerComponent('deck', {
    schema: {
    },
    init: function () { // initialize components to default values
        this.el.addEventListener('child-attached', function (ev) {
            ev.detail.el.addEventListener('mousedown', (evt) => {
                console.log("clicked on a piece!");
                console.log(evt)
            })    
            this.recomputeSize();
        })
        this.el.addEventListener('child-detached', function (ev) {
            this.recomputeSize();
        })
        this.el.setAttribute('body', {type: 'dynamic', shape: 'none'});
        this.el.setAttribute('shape', 'shape', 'box');
        for (const el of this.el.children) {
            el.addEventListener('mousedown', (evt) => {
                console.log("clicked on a piece!");
                console.log(evt)
                evt.preventDefault()
            })    
        }
    },
    update: function(oldData) {
        this.recomputeSize();
    },
    recomputeSize: function() {
        let x = 0;
        let y = 0;
        let z = 0;

        for (const el of this.el.children) {
            let piece = el.getAttribute('piece');
            x = Math.max(x, piece.width / 2);
            y = Math.max(y, piece.height / 2);
            z += piece.depth / 2;
        }
        this.el.setAttribute('shape', {halfExtents: {x, y, z}});
    }
})

AFRAME.registerPrimitive('a-deck', {
    defaultComponents: {
        deck: {},
    },
    mappings: {}
});
