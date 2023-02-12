'use strict';

const { CommonInstanceDependencies } = require('@babel/preset-env/lib/polyfills/corejs3/built-in-definitions.js');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  
  const coorRegex = /^[A-I][1-9]$/i;
  const valueRegex = /^[1-9]$/;

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle, coordinate, value} = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' })
      };
      if (solver.validate(puzzle).error === 'Expected puzzle to be 81 characters long') {
        return res.json(solver.validate(puzzle));
      }
      if (solver.validate(puzzle).error === 'Invalid characters in puzzle') {
        return res.json(solver.validate(puzzle));
      };
      
      if (!coorRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' })
      };
      if (!valueRegex.test(value)) {
        return res.json({ error: 'Invalid value' })
      };

      let row = coordinate.split("")[0];
      let column = coordinate.split("")[1];
      let validCol = solver.checkColPlacement(puzzle, row, column, value);
      let validRow = solver.checkRowPlacement(puzzle, row, column, value);
      let validReg = solver.checkRegionPlacement(puzzle, row, column, value);
      let conflicts = [];
    
      if (validCol && validRow && validReg) {
        return res.json({ valid: true });
      } else {
        if (!validRow){
          conflicts.push('row');
        }
        if (!validCol){
          conflicts.push('column');
        }
        if (!validReg){
          conflicts.push('region');
        }
        return res.json({valid: false, conflict: conflicts})
      }

        // if (!validRow){
        //   conflicts.push('row');
        // };
        // if (!validCol){
        //   conflicts.push('column');
        // };
        // if (!validReg){
        //   conflicts.push('region');
        // };
        // if (conflicts.length !== 0) {
        // return res.json({valid: false, conflict: conflicts});
        // };
        // res.json({ valid: true });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body;
      if (!puzzle) {
        return res.json({error: 'Required field missing'})
      };
      if (solver.validate(puzzle).error === 'Expected puzzle to be 81 characters long') {
        return res.json(solver.validate(puzzle));
      }
      if (solver.validate(puzzle).error === 'Invalid characters in puzzle') {
        return res.json(solver.validate(puzzle));
      };
      let solvedString = solver.solve(puzzle);
      if (!solvedString) {
        return res.json({error: 'Puzzle cannot be solved'})
      } else {
        return res.json({ solution: solvedString })
      }
    });
};
