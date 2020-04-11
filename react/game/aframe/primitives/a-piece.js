import 'aframe';

AFRAME.registerComponent('piece', {
    schema: {
        front: {type: 'asset'},
        back: {type: 'asset'}, // if null will use the same as the front but mirrored
        width: {default: 0.6},
        height: {default: 1},
        depth: {default: 0.02}
    },
    init: function () {
        this.el.setAttribute('geometry', {primitive: 'plane'});
        this.el.setAttribute('material', {
            color: '#FFF',
            shader: 'flat',
            side: 'double',
            transparent: true
        })
        this.el.setAttribute('body', {type: 'static', shape: 'none'})
        this.el.setAttribute('shape', {shape: 'box'})
    },
    update: function (oldData) {
        this.el.setAttribute('geometry', {width: this.data.width, height: this.data.height})
        this.el.setAttribute('shape', 'halfExtents', {x: this.data.width / 2, y: this.data.height / 2, z: this.data.depth / 2})
        this.el.setAttribute('material', 'src', this.data.front)
    }
})

AFRAME.registerPrimitive('a-piece', {
    defaultComponents: {
        piece: {},
    },
    mappings: {
        front: 'piece.front',
        back: 'piece.back',
        width: 'piece.width',
        height: 'piece.height',
        depth: 'piece.depth',
    }
});
