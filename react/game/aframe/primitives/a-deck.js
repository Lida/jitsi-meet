import 'aframe';
import { movePiece } from '../networking';

var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

AFRAME.registerComponent('deck', {
    schema: {
        cardWidth: {default: 0.55},
        cardHeight: {default: .85},
        cardDepth: {default: 0.035},
        cardDepthInDeck: {default: 0.01},
        draw: {type: 'selector', default: '#hand'},
        shuffle: {default: true},
        tooltip: {type: 'string'}
    },    
    init: function () { // initialize components to default values
        let self = this;
        
        this.el.addEventListener('child-attached', function (ev) {
            self.setCardAttributes(ev.detail.el)
            self.cards.push(ev.detail.el);
            self.recomputeSize();
        })
        this.el.addEventListener('child-detached', function (ev) {
            self.cards.splice(self.cards.indexOf(ev.detail.el), 1);
            self.recomputeSize();
        })
        this.el.addEventListener('click', (evt) => {
            console.log("clicked on a deck!");
            let draw = this.data.draw;
            let el = this.cards[this.cards.length - 1];
            el.setAttribute("draggable", true); // for consistency sake since setting it doesn't do anything after initialization mapping
            el.setAttribute("piece", "draggable", true);
            el.setAttribute("depth", this.data.cardDepth);
            el.setAttribute("piece", "depth", this.data.cardDepth);
            el.flushToDOM(true);
            let copy = el.cloneNode();            
            el.parentNode.removeChild(el);
            draw.appendChild(copy);
            copy.setAttribute("exposed", true);
            this.el.sceneEl.systems.networking.dispatch(movePiece(1, this.data.draw.id));
        });
        this.el.addEventListener('mouseenter', (ev) => {
            this.el.setAttribute('text', {value: this.data.tooltip});
        })
        this.el.addEventListener('mouseleave', (ev) => {
            this.el.setAttribute('text', {value: ''});
        })
        for (let i = 0; i < this.el.children.length; i++) {
            const el = this.el.children[i]
            this.setCardAttributes(el);
        }
        this.cards = Array.from(this.el.children); // keep track of card order
        if (this.data.shuffle) {
            shuffle(this.cards);
        }

        this.el.setAttribute('ammo-body', {type: 'dynamic'});
        this.el.setAttribute('geometry', {primitive: 'box'});
        this.el.setAttribute('material', {transparent: true, opacity: 0})
        this.el.setAttribute('text', {
            transparent: false, 
            width: 4,
            align: 'center',
        });
    },
    update: function(oldData) {
        this.recomputeSize();
    },
    setCardAttributes: function (el) {
        el.setAttribute("dynamic", false);
        el.setAttribute("piece", "dynamic", false);
        el.setAttribute("draggable", false);
        el.setAttribute("piece", "draggable", false);
        el.setAttribute("depth", this.data.cardDepthInDeck);
        el.setAttribute("piece", "depth", this.data.cardDepthInDeck);
        el.setAttribute("width", this.data.cardWidth);
        el.setAttribute("piece", "width", this.data.cardWidth);
        el.setAttribute("height", this.data.cardHeight);
        el.setAttribute("piece", "height", this.data.cardHeight);
    },
    recomputeSize: function() {
        let x = 0;
        let y = 0;
        let z = 0;
        for (let i = 0; i < this.cards.length; i++) {
            const el = this.cards[i]
            el.setAttribute("position", {x: 0, y: 0, z: i * this.data.cardDepthInDeck - this.el.children.length * this.data.cardDepthInDeck / 2});
            el.setAttribute("rotation", {x: 0, y: 0, z: 0});
        }
        this.el.setAttribute('geometry', {width: this.data.cardWidth + 0.02, height: this.data.cardHeight + 0.02, depth: this.cards.length * this.data.cardDepthInDeck + 0.02});
        this.el.setAttribute('text', 'zOffset', this.cards.length * this.data.cardDepthInDeck /2 + 0.02);
        this.el.removeAttribute('ammo-shape'); // physics driver doesn't handle shape updates
        this.el.setAttribute('ammo-shape', {type: 'box'});
    }
})

AFRAME.registerPrimitive('a-deck', {
    defaultComponents: {
        deck: {},
    },
    mappings: {
        width: "deck.cardWidth",
        height: "deck.cardHeight",
        depth: "deck.cardDepth",
        tooltip: "deck.tooltip",
        draw: "deck.draw",
        shuffle: "deck.shuffle"
    }
});
