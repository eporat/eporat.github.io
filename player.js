class Player {
    constructor(row, col, c){
        this.row = row;
        this.col = col;
        this.color = c;
        this.tilecount = 0;
    }
    
    draw(){
        push();
        stroke(this.color)
        fill(this.color);
        ellipse(0, 0, 0.025*size, 0.025*size)
        pop();
    }
}
