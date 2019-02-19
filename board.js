const directions = {
    'left': [0, -1],
    'right': [0, 1],
    'up': [-1, 0],
    'down': [1, 0]
};

let uitile;

class Board {
    constructor(size){
        this.board = new Array();
        this.tiles = new Map();
        this.player1 = new Player(0, int(size/2), 'blue');
        this.player2 = new Player(size - 1, int(size/2), 'red');
        this.size = size;
        for (let row = 0; row < size; row++){
            this.board.push(new Array())
            for (let col = 0; col < size; col++){
                this.board[row].push(new Square(SQUARE_SIZE));
            }
        }
    }

    _setTile(row, col, orientation, value){
        if (orientation === 'horizontal'){
            this.board[row - 1][col    ].down = value;
            this.board[row - 1][col + 1].down = value;
            this.board[row    ][col    ].up = value;
            this.board[row    ][col + 1].up = value;

        } else {
            this.board[row    ][col - 1].right = value;
            this.board[row + 1][col - 1].right = value;
            this.board[row    ][col    ].left = value;
            this.board[row + 1][col    ].left = value;
        }
    }

    _canPlaceTile(row, col, orientation){
        if (turn === 1 && this.player1.tilecount === 10){
            return false;
        }

        if (turn === 2 && this.player2.tilecount === 10){
            return false;
        }

        if (orientation === 'horizontal'){
            if (!(row > 0 && row < this.size && col >= 0 && col < this.size - 1)){
                return false
            }

            if (this.tiles.has(`${row}, ${col - 1}, horizontal`)){
                return false;
            }

            if (this.tiles.has(`${row}, ${col}, horizontal`)){
                return false;
            }

            if (this.tiles.has(`${row}, ${col + 1}, horizontal`)){
                return false;
            }

            if (this.tiles.has(`${row - 1}, ${col + 1}, vertical`)){
                return false;
            }
        } else {
            if (!(row >= 0 && row < this.size - 1 && col > 0 && col < this.size)){
                return false;
            }

            if (this.tiles.has(`${row - 1}, ${col}, vertical`)){
                return false;
            }

            if (this.tiles.has(`${row}, ${col}, vertical`)){
                return false;
            }

            if (this.tiles.has(`${row + 1}, ${col}, vertical`)){
                return false;
            }

            if (this.tiles.has(`${row + 1}, ${col - 1}, horizontal`)){
                return false;
            }
        }

        this.placeTile(row, col, orientation);
        if (!pathExists([this.player1.row, this.player1.col], this.size-1) || !pathExists([this.player2.row, this.player2.col], 0)){
            this.removeTile(row, col, orientation);
            return false;
        }

        this.removeTile(row, col, orientation);
        return true;
    }

    placeTile(row, col, orientation){
        this._setTile(row, col, orientation, true);
        this.tiles.set(`${row}, ${col}, ${orientation}`, new Tile(row, col, orientation))
    }

    
    removeTile(row, col, orientation){
        if (!this.tiles.has(`${row}, ${col}, ${orientation}`)){
            return false;
        }
        this._setTile(row, col, orientation, false);
        this.tiles.delete(`${row}, ${col}, ${orientation}`)
    }

    _translate(row, col){
        translate(OFFSET_X+SQUARE_SIZE*col, OFFSET_Y+SQUARE_SIZE*row)
    }

    draw(){
        for (let row = 0; row < this.size; row++){
            for (let col = 0; col < this.size; col++){
                push();
                this._translate(row, col)
                this.board[row][col].draw();
                pop();
            }
        }

        for (let tile of this.tiles.values()){
            push();
            this._translate(tile.row, tile.col);
            tile.draw();
            pop();
        }

        push();
        this._translate(this.player1.row, this.player1.col)
        this.player1.draw();
        pop();

        push();
        this._translate(this.player2.row, this.player2.col)
        this.player2.draw();
        pop();

        this.drawUI();
    }

    drawUI(){
        push();
        let row, col;

        uitile = null;
        if (orientation == 'horizontal'){
            row = round((mouseY - OFFSET_Y)/SQUARE_SIZE + 0.5);
            col = round((mouseX - OFFSET_X)/SQUARE_SIZE - 0.5);
        }
        else {
            row = round((mouseY - OFFSET_Y)/SQUARE_SIZE - 0.5);
            col = round((mouseX - OFFSET_X)/SQUARE_SIZE + 0.5);
        }

        this._translate(row, col);
        if (this._canPlaceTile(row, col, orientation)){
            uitile = new UITile(row, col, orientation)
            uitile.draw();
        }

        pop();
    }

    outOfBounds(row, col){
        return row < 0 || row >= this.size || col < 0 || col >= this.size; 
    }

    _canMove(player, direction){
    }

    hasWall(row, col, direction){
        return this.board[row][col][direction]
    }

    move(playerNum, direction){
        let player = playerNum == 1 ? this.player1 : this.player2;
        let otherPlayer = playerNum == 1 ? this.player2 : this.player1;
        const row = player.row;
        const col = player.col;

        if (this.outOfBounds(player.row + directions[direction][0], player.col + directions[direction][1])){
            return false;
        }

        if (this.hasWall(row, col, direction)){
            return false;
        }

        let [drow, dcol] = directions[direction];

        if (otherPlayer.row === player.row + drow && otherPlayer.col === player.col + dcol){
            if (this.hasWall(row+drow, col+dcol, direction)){
                if (direction == 'up' || direction === 'down'){
                    let possibleDirections = [];
                    if (!this.outOfBounds(player.row + drow, player.col + dcol - 1) && !this.hasWall(player.row + drow, player.col + dcol - 1, 'left')){
                        possibleDirections.push('left')
                    }
                    if (!this.outOfBounds(player.row + drow, player.col + dcol + 1) && !this.hasWall(player.row + drow, player.col + dcol + 1, 'right')){
                        possibleDirections.push('right')
                    }

                    if (possibleDirections.length == 0){
                        alert('Invalid Move!');
                    }
                    else if (possibleDirections.length == 1){
                        player.row += drow + directions[possibleDirections[0]][0];
                        player.col += dcol + directions[possibleDirections[0]][1];
                    }
                    else {
                        let dir = prompt("Left or Right")
                        while (dir.toLowerCase() != 'left' && dir.toLowerCase() != 'right'){
                            prompt("Invalid. Left or Right")
                        }

                        player.row += drow + directions[dir.toLowerCase()][0];
                        player.col += dcol + directions[dir.toLowerCase()][1];
                    }

                } else {
                    let possibleDirections = [];
                    if (!this.outOfBounds(player.row + drow - 1, player.col + dcol) && !this.hasWall(player.row + drow - 1, player.col + dcol, 'up')){
                        possibleDirections.push('up')
                    }
                    if (!this.outOfBounds(player.row + drow + 1, player.col + dcol) && !this.hasWall(player.row + drow + 1, player.col + dcol, 'down')){
                        possibleDirections.push('down')
                    }

                    if (possibleDirections.length == 0){
                        alert('Invalid Move!');
                    }
                    else if (possibleDirections.length == 1){
                        player.row += drow + directions[possibleDirections[0]][0];
                        player.col += dcol + directions[possibleDirections[0]][1];
                    }
                    else {
                        let dir = prompt("Up or Down")
                        while (dir.toLowerCase() != 'up' && dir.toLowerCase() != 'down'){
                            prompt("Invalid. Up or Down")
                        }

                        player.row += drow + directions[dir.toLowerCase()][0];
                        player.col += dcol + directions[dir.toLowerCase()][1];
                    }
                }
            } else {
                player.row += drow + drow;
                player.col += dcol + dcol; 
            }
        }

        else {
            player.row += drow;
            player.col += dcol;
        }
        turn = turn === 1 ? 2 : 1;

        if (this.player1.row === this.size - 1){
            alert("Blue Won!")
            gameover = true;
            noLoop();
        } else if (this.player2.row === 0){
            alert("Red Won!")
            gameover = true;
            noLoop();
        }

    }

    mousePressed(){
        if (uitile){
            if (turn === 1){
                this.player1.tilecount += 1;
            } else {
                this.player2.tilecount += 1;
            }
            board.placeTile(uitile.row, uitile.col, orientation)
            turn = turn === 1 ? 2 : 1;
        }
        uitile = null;
    }
}



