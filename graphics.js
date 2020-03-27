class Display {
    constructor(lacerda) {
        this.lacerda = lacerda;
        this.width = 845;
        this.height = 1515;

        this.stage = new Konva.Stage({
            container: 'container',
            width: this.width,
            height: this.height,
        });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        this.sources = {
            // general
            background: 'assets/background.png',
            backbutton: 'assets/buttons/back-button@3x.png',
            backbutton_pressed: 'assets/buttons/back-button-pressed@3x.png',
            backbutton_hover: 'assets/buttons/back-button-hover@3x.png',

            // colonization phase; travel
            shuttle: 'assets/shuttle-icon-centered@3x.png',
            travel_arrows: 'assets/travel-arrows-left-right@3x.png',
            shuttle_phase_indicator: 'assets/shuttle-phase-graphical-indicator@3x.png',
            init_shuttle: 'assets/buttons/initiate-shuttle-phase.png',
            init_shuttle_pressed: 'assets/buttons/initiate-shuttle-phase_pressed.png',
            init_shuttle_hover: 'assets/buttons/initiate-shuttle-phase_hover.png',
            
            // colonization phase; no travel
            shuttle_nogo: 'assets/no-travel-icon@3x.png',
            next_round: 'assets/buttons/next-round.png',
            next_round_pressed: 'assets/buttons/next-round_pressed.png',
            next_round_hover: 'assets/buttons/next-round_hover.png',
            colonization_phase_indicator: 'assets/2@3x.png',
        };

        this.startScreen = new StartScreen(this.sources);
        this.hexTiebreaker = new HexTiebreaker();
        this.cardTiebreaker = new CardTiebreaker(this.sources);
        this.techTiebreaker = new TechTiebreaker(this.sources);
        this.turnOrder = new TurnOrder();

        this.labels = {};
        this.shapes = {};
        this.images = {};
        this.buttons = {};

        this.setupLabels();
        this.setupShapes();
        this.loadImages();
    }

    setupStage() {
        this.layer.add(this.images.background);
        this.layer.add(this.buttons.backbutton);
        this.layer.add(this.labels.status);
        this.layer.add(this.images.colonization_phase_indicator);
        this.layer.add(this.images.shuttle_phase_indicator);
        this.layer.add(this.shapes.active_mission);
        this.layer.add(this.labels.mission);
        this.layer.add(this.labels.action);

        this.layer.add(this.buttons.init_shuttle);
        this.layer.add(this.images.shuttle);
        this.layer.add(this.images.travel_arrows);

        this.layer.add(this.buttons.next_round);
        this.layer.add(this.images.shuttle_nogo);

        this.stage.add(this.hexTiebreaker.layer);
        this.stage.add(this.cardTiebreaker.layer);
        this.stage.add(this.techTiebreaker.layer);
        this.stage.add(this.turnOrder.layer);
    }

    renderScreen() {
        var state = this.lacerda.currentState();

        // status bar
        this.labels.status.text(
            "ROUND " +
            this.lacerda.currentRound + 
            " - " + 
            this.lacerda.currentPhase +
            " PHASE");

        // phase indicator
        if (this.lacerda.currentPhase == 'COLONIZATION' && state.turnOrders != null) {
            this.images.colonization_phase_indicator.show();
            this.images.shuttle_phase_indicator.hide();
        } else {
            this.images.colonization_phase_indicator.hide();
            this.images.shuttle_phase_indicator.show();
        }

        // mission marker
        if (state.mission != null) {
            this.labels.mission.text(['A', 'B', 'C'][state.mission-1]);
            //XXX: Please don't read the next 7 lines. It's an ugly hack to make
            //     sure mission marker letters are actually centered.
            if (state.mission == 1) {
                this.labels.mission.x(1);
            } else if (state.mission == 2) {
                this.labels.mission.x(2);
            } else {
                this.labels.mission.x(0);
            }
            this.shapes.active_mission.show();
        } else {
            this.labels.mission.text('');
            this.shapes.active_mission.hide();
        }

        // card tiebreaker
        this.cardTiebreaker.render(state);

        // current action
        this.labels.action.text(state.action);

        // tech tiebreaker
        this.techTiebreaker.render(state);

        // turn order
        this.turnOrder.render(state, this.lacerda.currentPhase);

        // hex tiebreaker
        this.hexTiebreaker.render(state);

        // buttons
        if (this.lacerda.currentPhase == 'SHUTTLE') {
            this.buttons.init_shuttle.hide();
            this.images.shuttle.hide();
            this.images.travel_arrows.show();

            this.buttons.next_round.show();
        } else if (state.turnOrders != null) {
            this.buttons.init_shuttle.show();
            this.images.shuttle.show();
            this.images.travel_arrows.show();
            this.buttons.next_round.hide();
            this.images.shuttle_nogo.hide();
        } else {
            this.buttons.init_shuttle.hide();
            this.images.shuttle.hide();
            this.images.travel_arrows.hide();
            this.buttons.next_round.show();
            this.images.shuttle_nogo.show();
        }

        this.layer.draw();
    }

    imagesLoaded(images) {
        this.images['background'] = new Konva.Image({
            image: images.background,
        });
        this.images['colonization_phase_indicator'] = new Konva.Image({
            x: this.width/2 - images.colonization_phase_indicator.width/2,
            y: 195,
            image: images.colonization_phase_indicator,
        });
        this.images['shuttle_phase_indicator'] = new Konva.Image({
            x: this.width/2 - images.shuttle_phase_indicator.width/2,
            y: 195,
            image: images.shuttle_phase_indicator,
        });
        this.images['shuttle'] = new Konva.Image({
            image: images.shuttle,
            x: this.width/2 - images.shuttle.width/2,
            y: 1242,
        });
        this.images['travel_arrows'] = new Konva.Image({
            image: images.travel_arrows,
            x: this.width/2 - images.travel_arrows.width/2,
            y: 1264,
        });
        this.images['shuttle_nogo'] = new Konva.Image({
            image: images.shuttle_nogo,
            x: this.width/2 - images.shuttle_nogo.width/2,
            y: 1250,
        });

        this.startScreen.imagesLoaded(images);
        this.cardTiebreaker.imagesLoaded(images);
        this.techTiebreaker.imagesLoaded(images);

        // call these from here because we need the images for the buttons
        this.setupButtons(images);
        this.startScreen.setupButtons(images, this);

        this.stage.add(this.startScreen.layer);
        this.startScreen.render();
    }
    
    loadImages() {
        var images = {};
        var loadedImages = 0;
        var numImages = Object.keys(this.sources).length;

        for (var src in this.sources) {
            images[src] = new Image();
            images[src].onload = () => {
                if (++loadedImages >= numImages) {
                    this.imagesLoaded(images);
                }
            };
            images[src].src = this.sources[src];
        }
    }

    setupLabels() {
        this.labels['status'] = new Konva.Text({
            x: 0,
            y: 136,
            width: this.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 36,
            text: '',
            fill: '#E5E5DE'
        });
        this.labels['action'] = new Konva.Text({
            x: 0,
            y: 788, 
            width: this.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 147,
            text: '1',
            fill: 'white'
        });
        this.labels['mission'] = new Konva.Text({
            x: 0,
            y: 267,
            width: this.width,
            align: 'center',
            fontFamily: 'Continuum Medium Regular',
            fontSize: 108,
            text: '',
            fill: 'white'
        });
        console.log(this.labels['mission'].height());
    }

    setupButtons(images) {
    	// Need this, otherwise when you touch the button, move your finger
    	// (as if you were trying to drag the button), and release it outside
    	// the button areak, it would remain "pressed".
    	this.layer.on('touchend', () => {
        	this.buttons['next_round'].image(images.next_round);
        	this.buttons['init_shuttle'].image(images.init_shuttle);
            this.buttons['backbutton'].image(images.backbutton);
        	this.layer.draw();
        });

        ['init_shuttle', 'next_round', 'backbutton'].forEach((b) => {
            this.buttons[b] = new Konva.Image({
                image: images[b],
                x: (this.width - images[b].width) / 2,
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
        
        this.buttons['init_shuttle'].y(1340);
        this.buttons['next_round'].y(1355);

        this.buttons['next_round'].on('mouseup touchend', () => {
        	this.lacerda.nextState();
            this.renderScreen();
        });
        this.buttons['init_shuttle'].on('mouseup touchend', () => {
        	this.lacerda.currentPhase = 'SHUTTLE';
            this.renderScreen();
        });

        // The back button is the only non-centered button.
        this.buttons['backbutton'].x(0);
        this.buttons['backbutton'].y(0);
        this.buttons['backbutton'].on('click tap', () => {
            this.lacerda.prevState();
            this.renderScreen();
        });
    }

    setupShapes() {
        this.shapes['active_mission'] = new Konva.Circle({
            x: this.width / 2,
            y: 318,
            radius: 78,
            fill: '#cf4541',
        });
    }
}
