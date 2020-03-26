class TurnOrder {
    constructor() {
        this.layer = new Konva.Layer();

        this.shapes = [];
        this.shapes['turnorder_squares'] = [
        	new Konva.Rect({ x: 288, y: 1257, width: 54, height: 54 }),
        	new Konva.Rect({ x: 360, y: 1257, width: 54, height: 54 }),
        	new Konva.Rect({ x: 432, y: 1257, width: 54, height: 54 }),
        	new Konva.Rect({ x: 504, y: 1257, width: 54, height: 54 }),
        ];

        this.shapes['turnorder_circle'] = new Konva.Circle({
            y: 1183,
            radius: 5,
            stroke: '#1f8d7b',
            strokeWidth: 1,
        });

        this.shapes['turnorder_pointer'] = new Konva.Line({
                points: [
                    315+144, 1257,
                    315+144, 1241,
                    241+144, 1186,
                ],
    		stroke: '#1f8d7b',
    		strokeWidth: 1,
        });
        
        this.layer.add(this.shapes.turnorder_pointer);
        this.layer.add(this.shapes.turnorder_circle);
        for (var i = 0; i < 4; ++i) {
        	this.layer.add(this.shapes.turnorder_squares[i]);
        }
    }

    render(state, phase) {
        if (phase == 'SHUTTLE') {
            this.shapes.turnorder_pointer.points([
                315 + 72 * state.turnOrders[0], 1257,
                315 + 72 * state.turnOrders[0], 1241,
                315 + 72 * state.turnOrders[0] + (state.turnOrders[0] < 2 ? 74 : -74), 1186,
            ]);
            this.shapes.turnorder_pointer.show();
            this.shapes.turnorder_circle.x(
                315 + 72 * state.turnOrders[0] + (state.turnOrders[0] < 2 ? 77 : -77));
            this.shapes.turnorder_circle.show();

        	for (var i = 0; i < 4; ++i) {
        		if (i == state.turnOrders[0]) {
        			this.shapes.turnorder_squares[i].fill('#1f8d7b');
        		} else if (i == state.turnOrders[1]) {
        			this.shapes.turnorder_squares[i].fill('#588c83');
        		} else {
        			this.shapes.turnorder_squares[i].fill('#969693');
        		}
        		this.shapes.turnorder_squares[i].show();
        	}
        } else {
            this.shapes.turnorder_pointer.hide();
            this.shapes.turnorder_circle.hide();
        	for (var i = 0; i < 4; ++i) {
        		this.shapes.turnorder_squares[i].hide();
        	}
        }

        this.layer.draw();
    }
};
