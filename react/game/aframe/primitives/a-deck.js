import 'aframe';

AFRAME.registerComponent('deck', {
    schema: {
    },
    init: function () { // initialize components to default values
        const childMouseDown =  (evt) => {
            console.log("clicked on a deck!");
            let hand = document.getElementById('hand');
            let el = this.el.lastElementChild;
            el.setAttribute("draggable", true); // for consistency sake since setting it doesn't do anything after initialization mapping
            el.setAttribute("piece", "draggable", true);
            el.flushToDOM(true);
            let copy = el.cloneNode();            
            el.parentNode.removeChild(el);
            hand.appendChild(copy);
        }    
        let self = this
        this.el.addEventListener('child-attached', function (ev) {
            ev.detail.el.addEventListener('mousedown', childMouseDown);
            self.recomputeSize();
        })
        this.el.addEventListener('child-detached', function (ev) {
            ev.detail.el.removeEventListener('mousedown', childMouseDown);
            self.recomputeSize();
        })
        for (const el of this.el.children) {
            el.addEventListener('mousedown', childMouseDown);
        }
        this.el.setAttribute('ammo-body', {type: 'dynamic'});
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
        this.el.removeAttribute('ammo-shape'); // physics driver doesn't handle shape updates
        this.el.setAttribute('ammo-shape', {type: 'box', fit: 'manual', halfExtents: {x, y, z}});
    }
})

AFRAME.registerPrimitive('a-deck', {
    defaultComponents: {
        deck: {},
    },
    mappings: {}
});
