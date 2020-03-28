class MissionCircle {
    constructor(sources) {
        sources['mission_a'] = 'assets/missions/red-mission-circle-a@3x.png';
        sources['mission_b'] = 'assets/missions/red-mission-circle-b@3x.png';
        sources['mission_c'] = 'assets/missions/red-mission-circle-c@3x.png';
    
        this.images = [];
        this.placeholder = new Konva.Image({ x: 345, y: 240 });
        this.layer = new Konva.Layer();
        this.layer.add(this.placeholder);
    }

    imagesLoaded(images) {
        this.images = [
            images['mission_a'],
            images['mission_b'],
            images['mission_c'],
        ];
    }

    render(state) {
        if (state.mission != null) {
            console.log(this.images[state.mission-1]);
            this.placeholder.image(this.images[state.mission-1]);
            this.layer.draw();
        }
    }
};
