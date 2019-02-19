
class Tile {
    constructor(row, col, orientation){
        this.row = row;
        this.col = col;
        this.orientation = orientation;
        this.color = turn === 1 ? color(0, 0, 255, 255) : color(255, 0, 0, 255)
    }

    draw(){
        push();
        stroke('black');
        fill(this.color);
        if (this.orientation === 'vertical'){
            translate(-0.025*size, 0.025*size);
            rect(0, 0, 0.0125*size, 0.09*size);
        }
        else {
            translate(0.025*size, -0.025*size);
            rect(0, 0, 0.09*size, 0.0125*size);
        }
        pop();
    }
}

class UITile extends Tile {
    constructor(row, col, orientation){
        super(row, col, orientation);
        this.color = turn === 1 ? color(0, 0, 255, 100) : color(255, 0, 0, 100)
    }
}