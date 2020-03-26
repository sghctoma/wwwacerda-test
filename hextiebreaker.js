class HexTiebreaker {
    constructor() {
        this.hex_coordinates = [
            [{q: -6, r: +2}, {q: -6, r: +3}, {q: -6, r: +4}, null],   // left down
            [{q: -6, r: +4}, {q: -6, r: +3}, {q: -6, r: +2}, null],   // left up
            [{q: +6, r: -2}, {q: +6, r: -3}, {q: +6, r: -4}, null],   // right up
            [{q: +6, r: -4}, {q: +6, r: -3}, {q: +6, r: -2}, null],   // right down
            [{q: +2, r: -5}, {q: +3, r: -5}, {q: +4, r: -5}, {q: +5, r: -5}],   // top right down
            [{q: +5, r: -5}, {q: +4, r: -5}, {q: +3, r: -5}, {q: +2, r: -5}],   // top right up
            [{q: +2, r: +3}, {q: +3, r: +2}, {q: +4, r: +1}, {q: +5, r: +0}],   // bottom right up
            [{q: +5, r: +0}, {q: +4, r: +1}, {q: +3, r: +2}, {q: +2, r: +3}],   // bottom right down
            [{q: -5, r: +0}, {q: -4, r: -1}, {q: -3, r: -2}, {q: -2, r: -3}],   // top left up
            [{q: -2, r: -3}, {q: -3, r: -2}, {q: -4, r: -1}, {q: -5, r: -0}],   // top left down
            [{q: -2, r: +5}, {q: -3, r: +5}, {q: -4, r: +5}, {q: -5, r: +5}],   // bottom left up
            [{q: -5, r: +5}, {q: -4, r: +5}, {q: -3, r: +5}, {q: -2, r: +5}],   // bottom left down
        ];
        this.triangle_coordinates = [
            [{q: -6.00, r: +1.70}, {q: -5.00, r: -0.75}],   // left down
            [{q: -6.00, r: +4.30}, {q: -5.00, r: +5.75}],   // left up
            [{q: +6.00, r: -1.70}, {q: +5.00, r: +0.75}],   // right up
            [{q: +6.00, r: -4.30}, {q: +5.00, r: -5.75}],   // right down
            [{q: +1.75, r: -5.00}, {q: -0.75, r: -4.00}],   // top right down
            [{q: +5.25, r: -5.00}, {q: +6.75, r: -4.00}],   // top right up
            [{q: +1.75, r: +3.25}, null],                   // bottom right up
            [{q: +5.25, r: -0.25}, {q: +6.75, r: -2.75}],   // bottom right down
            [{q: -5.25, r: +0.25}, {q: -6.75, r: +2.75}],   // top left up
            [{q: -1.75, r: -3.25}, {q: +0.75, r: -4.75}],   // top left down
            [{q: -1.75, r: +5.00}, null],                   // bottom left up
            [{q: -5.25, r: +5.00}, {q: -6.75, r: +4.00}],   // bottom left down
        ];
        this.triangle_rotations = [180, 0, 0, 180, 120, 300, 60, 240, 60, 240, 300, 120];
 
        this.hexes = [
            new Konva.RegularPolygon({ sides: 6, radius: 37, rotation: 30, fill: '#097a6d' }),
            new Konva.RegularPolygon({ sides: 6, radius: 37, rotation: 30, fill: '#588c83' }),
            new Konva.RegularPolygon({ sides: 6, radius: 37, rotation: 30, fill: '#839e97' }),
            new Konva.RegularPolygon({ sides: 6, radius: 37, rotation: 30, fill: '#909b96' }),
        ];
        
        this.triangle1 = new Konva.RegularPolygon({
            sides: 3,
            radius: 22 / Math.sqrt(3),
            scaleY: 2/3,
            fill: '#1f8d7b',
        });

        this.triangle2 = new Konva.RegularPolygon({
            sides: 3,
            radius: 22 / Math.sqrt(3),
            scaleY: 2/3,
            fill: '#839e97',
        });

        this.layer = new Konva.Layer();
        this.hexes.forEach((hex) => {
            this.layer.add(hex);
        });
        this.layer.add(this.triangle1);
        this.layer.add(this.triangle2);
    }

    getHexCoordinates(q, r) {
        // horizontal distance: 2 * radius * 0.75
        // vertical distance: sqrt(3) * radius
        var x_offset = q * (74 * 0.75);
        var y_offset = (q / 2 + r) * Math.sqrt(3) * 37;
        if (y_offset < -74) {
            y_offset += 3;
        } else if (y_offset > 74) {
            y_offset -= 3;
        }
        return {
            x: 422 + x_offset,
            y: 724 + y_offset,
        };
    }

    render(state) {
        // XXX: coordinates could, and probably should be precomputed...
        var hex = 0;
        this.hex_coordinates[state.hexTiebreaker].forEach((c) => {
            if (c == null) {
                this.hexes[hex].hide(hex);
            } else {
                this.hexes[hex].show(hex);
                var canvas_coord = this.getHexCoordinates(c.q, c.r);
                this.hexes[hex].x(canvas_coord.x);
                this.hexes[hex].y(canvas_coord.y);
            }
            hex += 1;
        });
        var t1 = this.triangle_coordinates[state.hexTiebreaker][0];
        var c1 = this.getHexCoordinates(t1.q, t1.r);
        this.triangle1.x(c1.x);
        this.triangle1.y(c1.y);
        this.triangle1.rotation(this.triangle_rotations[state.hexTiebreaker]);
        var t2 = this.triangle_coordinates[state.hexTiebreaker][1];
        if (t2 == null) {
            this.triangle2.hide();
        } else {
            this.triangle2.show();
            var c2 = this.getHexCoordinates(t2.q, t2.r);
            this.triangle2.x(c2.x);
            this.triangle2.y(c2.y);
            this.triangle2.rotation(this.triangle_rotations[state.hexTiebreaker]);
        }

        this.layer.draw();
    }
};

