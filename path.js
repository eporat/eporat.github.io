function pathExists(point, targetRow){
    const queue = [point];
    const visited = new Set();

    while (queue.length !== 0){
        let [row, col] = queue.pop();

        visited.add(`${row}, ${col}`);

        for (let direction in directions){
            let [drow, dcol] = directions[direction];
            if (visited.has(`${row + drow}, ${col + dcol}`)){
                continue;
            }

            if (!board.outOfBounds(row + drow, col + dcol) && !board.hasWall(row, col, direction)){
                if (row + drow === targetRow){
                    return true;
                }
                queue.push([row + drow, col + dcol]);
            }
        }
    }

    return false;
}