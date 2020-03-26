class StartScreen {
    constructor(sources) {
        sources['startscreen'] = 'assets/startscreen.png';
        sources['reveal_start'] = 'assets/buttons/reveal-start-position.svg';
        sources['reveal_start_pressed'] = 'assets/buttons/reveal-start-position_pressed.svg';
        sources['reveal_start_hover'] = 'assets/buttons/reveal-start-position_hover.svg';
        sources['first_round'] = 'assets/buttons/round-one.svg';
        sources['first_round_pressed'] = 'assets/buttons/round-one_pressed.svg';
        sources['first_round_hover'] = 'assets/buttons/round-one_hover.svg';

        this.layer = new Konva.Layer();
        this.buttons = [];
    }

    imagesLoaded(images) {
        this.background = new Konva.Image({ image: images.startscreen });
    }

    setupButtons(images, display) {
        // Need this, otherwise when you touch the button, move your finger
    	// (as if you were trying to drag the button), and release it outside
    	// the button areak, it would remain "pressed".
    	this.layer.on('touchend', () => {
        	this.buttons['reveal_start'].image(images.reveal_start);
        	this.buttons['first_round'].image(images.first_round);
        	this.layer.draw();
        });

        ['reveal_start', 'first_round'].forEach((b) => {
            this.buttons[b] = new Konva.Image({
                image: images[b],
                x: (display.width - images[b].width * 1.5) / 2,
                width: images[b].width * 1.5,
                height: images[b].height * 1.5,
            });
            this.buttons[b].on('mouseover', () => {
                this.buttons[b].image(images[b + '_hover']);
                this.layer.draw();
            });
            this.buttons[b].on('mousedown touchstart', () => {
                this.buttons[b].image(images[b + '_pressed']);
                this.layer.draw();
            });
            this.buttons[b].on('mouseout touchend mouseup', () => {
                this.buttons[b].image(images[b]);
                this.layer.draw();
            });
        });

        this.buttons['reveal_start'].y(1340);
        this.buttons['first_round'].y(1355);
        
        this.buttons['reveal_start'].on('mouseup touchend', () => {
        	this.revealStartPosition(display.lacerda.startPositions);
        });
        this.buttons['first_round'].on('mouseup touchend', () => {
        	this.layer.destroy();
            display.setupStage();

            display.lacerda.nextState();
            display.renderScreen();
        });
    }

    revealStartPosition(startPositions) {
    	var posLacerda = startPositions[0];
    	var offset = (posLacerda < 4 ? 82 : 493);
    	var color;
    	for (var i = 0; i < 4; ++i) {
    		if (posLacerda % 4 == i) {
    			color = '#1f8d7b';
    		} else {
    			color = '#969693';
    		}
    		this.layer.add(new Konva.Rect({
    			x: offset + i * 72,
    			y: 1257,
    			width: 54,
    			height: 54,
    			fill: color,
    		}));
    	}

    	var pentagon_x = posLacerda < 4 ? 217 : 629
    	this.layer.add(new Konva.RegularPolygon({
	        x: pentagon_x,	
	        y: 1168,
	        sides: 5,
	        radius: 50,
	        stroke: '#1f8d7b',
	        strokeWidth: 4,
	    }));

		var startpos_x = offset + (posLacerda % 4) * 72 + 27;
    	this.layer.add(new Konva.Line({
    		points: [
    			pentagon_x, 1210,
    			pentagon_x, 1225,
    			startpos_x, 1225,
    			startpos_x, 1257],
    		stroke: '#1f8d7b',
    		strokeWidth: 2,
    	}));
	    
        this.buttons.reveal_start.hide();
        this.layer.add(this.buttons.first_round);
        
        this.layer.draw();
    }

    render() {
        this.layer.add(this.background);
        this.layer.add(this.buttons['reveal_start']);
        this.layer.draw();
    }
};
