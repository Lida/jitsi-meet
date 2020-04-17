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
            el.setAttribute("depth", 0.035);
            el.setAttribute("piece", "depth", 0.035);
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
        for (let i = 0; i < this.el.children.length; i++) {
            const el = this.el.children[i]
            el.addEventListener('mousedown', childMouseDown);
            el.setAttribute("dynamic", false);
            el.setAttribute("piece", "dynamic", false);
            el.setAttribute("draggable", false);
            el.setAttribute("piece", "draggable", false);
            el.setAttribute("depth", "0.01");
            el.setAttribute("piece", "depth", "0.01");
            el.setAttribute("position", {x: 0, y: 0, z: i * 0.01 - this.el.children.length * 0.005});
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
        for (let i = 0; i < this.el.children.length; i++) {
            const el = this.el.children[i]
            let piece = el.components.piece.data;
            x = Math.max(x, piece.width / 2);
            y = Math.max(y, piece.height / 2);
            el.setAttribute("position", {x: 0, y: 0, z: i * 0.01 - this.el.children.length * 0.005});
        }
        this.el.removeAttribute('ammo-shape'); // physics driver doesn't handle shape updates
        this.el.setAttribute('ammo-shape', {type: 'box', fit: 'manual', halfExtents: {x, y, z: 0.01 * this.el.children.length / 2}});
    }
})

AFRAME.registerPrimitive('a-deck', {
    defaultComponents: {
        deck: {},
    },
    mappings: {}
});
