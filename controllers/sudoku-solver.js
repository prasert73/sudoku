class SudokuSolver {
  generateGrid(puzzleString){
    let grid = [[],[],[],[],[],[],[],[],[]];
    let gridRow = -1;
    let i;
    let values = puzzleString.split("");
    for (i=0; i<values.length; i++){
      if (i % 9 === 0) {
        gridRow +=1;
      };
      grid[gridRow].push(values[i])
      }
    return grid;
  }

  letterToNumber(letter){
    switch (letter.toUpperCase()){
    case "A":
      return 1;
    case "B":
      return 2;
    case "C":
      return 3;
    case "D":
      return 4;
    case "E":
      return 5;
    case "F":
      return 6;
    case "G":
      return 7;
    case "H":
      return 8;
    case "I":
      return 9;
    default:
      return 'invalid';
    }
  }

  validate(puzzleString) {
    const regex = /^[1-9.]+$/;
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    };
    if (!regex.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' }
    };
    return puzzleString;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.generateGrid(puzzleString);
    row = this.letterToNumber(row);
    // if (grid[row-1][column-1] != '.') {
    //   return false;
    // };
    if (grid[row-1][column-1] == value) {
      return true;
    }

    for (let i=0; i<9; i++) {
      if (grid[row-1][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.generateGrid(puzzleString);
    row = this.letterToNumber(row);
    // if (grid[row-1][column-1] != '.') {
    //   return false;
    // };
    if (grid[row-1][column-1] == value) {
      return true;
    }

    for (let i=0; i<9; i++) {
      if (grid[i][column-1] == value) {
        return false;
      }
    }
    return true;

  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.generateGrid(puzzleString);
    row = this.letterToNumber(row);
    // if (grid[row-1][column-1] != '.') {
    //   return false;
    // };
    if (grid[row-1][column-1] == value) {
      return true;
    }
    let startRow = row - (row % 3);
    let startCol = column - (column %3);
    for (let i=0; i<3; i++) {
      for (let j=0; j<3; j++){
        if (grid[startRow+i][startCol+j] == value) {
          return false;
        }
      }
    }
    return true;
  }

  solveSudoku(grid,row,column) {
    if (row == 9 - 1 && column == 9)
       return grid;
    if (column == 9) {
       row++;
       column = 0;
    }
    if (grid[row][column] != '.')
       return this.solveSudoku(grid, row, column + 1);
    for(let num = 1; num < 10; num++){
       if (this.isSafe(grid, row, column, num)){
          grid[row][column] = num;
          if (this.solveSudoku(grid, row, column + 1))
          return grid;
       }
       grid[row][column] = '.';
   }
   return false;
  }
  
  isSafe(grid, row, column, num) {
    for(let x = 0; x <= 8; x++)
        if (grid[row][x] == num)
            return false;
    for(let x = 0; x <= 8; x++)
        if (grid[x][column] == num)
            return false;
    let startRow = row - row % 3,
        startCol = column - column % 3;
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (grid[i + startRow][j + startCol] == num)
                return false;
    return true;
}

  transformGridToText(grid){
    return grid.flat().join('');
  }
  solve(puzzleString) {
    let grid = this.generateGrid(puzzleString);
    let solved = this.solveSudoku(grid,0,0);
    if (!solved) {
      return false;
    }
    let solvedString = this.transformGridToText(grid);
    return solvedString;
  }
}

module.exports = SudokuSolver;

