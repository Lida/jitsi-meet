import 'aframe';

AFRAME.registerComponent('piece', {
    schema: {
        front: {type: 'asset'},
        back: {type: 'asset'}, // if null will use the same as the front but mirrored
        width: {default: 0.6},
        height: {default: 1},
        depth: {default: 0.01},
        color: {default: '#FFF'},
        dynamic: {default: false},
        hoverHeight: {default: 0.2}, // how high to hover while dragged
        draggable: {default: true}
    },
    init: function () { // initialize components to default values
        this.el.setAttribute('geometry', {primitive: 'box'});
        this.el.setAttribute('material', {
            color: this.data.color,
        })
        this.el.setAttribute('velocity', {x: 0, y: 0, z: 0})
        this.el.addEventListener('mousedown', this.mouseDownHandler.bind(this));
        this.el.addEventListener('mouseup', this.mouseUpHandler.bind(this));
        this.defaultMouseDown = this.defaultMouseDown.bind(this);
        this.defaultMouseUp = this.defaultMouseUp.bind(this);
    },
    update: function (oldData) {
        this.el.setAttribute('geometry', {width: this.data.width, height: this.data.height, depth: this.data.depth})
        if (!oldData || oldData.dynamic != this.data.dynamic) {
            this.el.removeAttribute('body');
            this.el.removeAttribute('shape');
            this.el.setAttribute('body', {type: this.data.dynamic ? 'dynamic' : 'static', shape: 'none'})
            if (this.data.dynamic) {
                this.el.setAttribute('shape', {halfExtents: {x: this.data.width / 2, y: this.data.height / 2, z: this.data.depth / 2}, shape: 'box'})
            }    
        }
        this.el.setAttribute('material', 'src', this.data.front)
    },
    tock: function() {
        if (this.el.is('dragged')) { // find target location for dragged piece
            let distance = 1000;
            let closest = null;
            let raycaster = this.el.sceneEl.components.raycaster;
            for (const el of raycaster.intersectedEls) {
                let intersection = raycaster.getIntersection(el);
                if (intersection.distance < distance && el != this.el) {
                    distance = intersection.distance;
                    closest = intersection;
                }
            }
            if (closest) {
                let normal = new THREE.Vector3(closest.face.normal.x, closest.face.normal.y, closest.face.normal.z);
                let quat = new THREE.Quaternion();
                quat.setFromRotationMatrix(closest.object.matrixWorld);
                normal.applyQuaternion(quat);

                let hoverPosition = {x: normal.x * this.data.hoverHeight + closest.point.x, y: normal.y * this.data.hoverHeight + closest.point.y, z: normal.z * this.data.hoverHeight + closest.point.z};
                this.el.object3D.position.copy(hoverPosition);
                quat.setFromUnitVectors(this.el.object3D.up, normal);
                this.el.object3D.setRotationFromQuaternion(quat);
                this.el.object3D.rotateX(-Math.PI / 2);
                if (this.el.body) {
                    this.el.body.position.copy(hoverPosition);                    
                }
            }
        }
    },
    setOnMouseDown: function(onmousedown: Function) {
        this.onmousedown = onmousedown;        
    },
    setOnMouseUp: function(onmouseup: Function) {
        this.onmouseup = onmouseup;        
    },
    defaultMouseDown: function() {
        console.log("self mousedown")
    },
    defaultMouseUp: function() {
        console.log("self mouseup")
    },
    mouseDownHandler: function(evt) {
        if (this.data.draggable) {
            this.el.addState('dragged');
            this.el.setAttribute('piece', 'dynamic', 'false');
        }
        (this.onmousedown || this.defaultMouseDown)(evt);
    },
    mouseUpHandler: function(evt) {
        if (this.data.draggable) {
            this.el.removeState('dragged');
            this.el.setAttribute('piece', 'dynamic', 'true');    
        }
        (this.onmouseup || this.defaultMouseUp)(evt);
    }
})

AFRAME.registerPrimitive('a-piece', {
    defaultComponents: {
        piece: {},
        shadow: {}
    },
    mappings: {
        front: 'piece.front',
        back: 'piece.back',
        width: 'piece.width',
        height: 'piece.height',
        depth: 'piece.depth',
        color: 'piece.color',
        dynamic: 'piece.dynamic',
        draggable: 'piece.draggable',
        "hover-height": 'piece.hoverHeight'
    }
});
