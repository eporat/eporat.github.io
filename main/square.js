class Square {
    constructor(){
        this.size = 0.04*size;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
    }

    draw(){
        push();
        fill('brown')
        stroke('black');
        rect(0, 0, this.size, this.size);
        pop();
    }
}
