const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const testPuzzle = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

suite('Unit Tests', () => {
   test('valid puzzle string of 81 characters', (done)=>{
        const puzzle = testPuzzle[0][0];
        assert.equal(solver.validate(puzzle), puzzle);
        done();
   })
   
   test('puzzle string with invalid characters (not 1-9 or .', (done)=>{
      let invalidPuzzle = testPuzzle[0][0].split('');
      invalidPuzzle[0] = 'a';
      invalidPuzzle = invalidPuzzle.join('');
      assert.equal(solver.validate(invalidPuzzle).error, 'Invalid characters in puzzle');
      done();
   })
   test('puzzle string that is not 81 characters in length', (done)=>{
      let invalidPuzzle = testPuzzle[0][0].split('');
      invalidPuzzle.push('1');
      invalidPuzzle = invalidPuzzle.join('');
      assert.equal(solver.validate(invalidPuzzle).error, 'Expected puzzle to be 81 characters long');
      done();
   })
   test('valid row placement', (done)=>{
      let puzzle = testPuzzle[0][0];
      assert.equal(solver.checkRowPlacement(puzzle, 'a', 1, 1), true);
      done();
   })
   test('invalid row placement', (done)=>{
      let puzzle = testPuzzle[0][0];
      assert.equal(solver.checkRowPlacement(puzzle, 'a', 1, 4), false);
      done();
   })
   test('valid column placement', (done)=>{
      let puzzle = testPuzzle[0][0];
      assert.equal(solver.checkColPlacement(puzzle, 'a', 1, 1), true);
      done();
   })
   test('invalid row placement', (done)=>{
      let puzzle = testPuzzle[0][0];
      assert.equal(solver.checkColPlacement(puzzle, 'a', 1, 3), false);
      done();
   })
   test('valid region placement', (done)=>{
      let puzzle = testPuzzle[0][0];
      assert.equal(solver.checkRegionPlacement(puzzle, 'a', 1, 1), true);
      done();
   })
   test('invalid region placement', (done)=>{
      let puzzle = testPuzzle[0][0];
      assert.equal(solver.checkRegionPlacement(puzzle, 'a', 1, 6), false);
      done();
   })
   test('Valid puzzle strings pass the solver', (done)=>{
      let puzzle = testPuzzle[0][0];
      let validatedPuzzle = solver.validate(puzzle);
      assert.equal(solver.solve(validatedPuzzle), testPuzzle[0][1]);
      done();
   })
   test('Invalid puzzle strings fail the solver', (done)=>{
      let invalidPuzzle = testPuzzle[0][0].split('');
      invalidPuzzle[0] = '3';
      invalidPuzzle = invalidPuzzle.join('');
      let validatedPuzzle = solver.validate(invalidPuzzle);
      assert.equal(solver.solve(invalidPuzzle), false);
      done();
   })
   test('Solver returns the expected solution for an incomplete puzzle', (done)=>{
      let puzzle = testPuzzle[0][0];
      let validatedPuzzle = solver.validate(puzzle);
      assert.equal(solver.solve(validatedPuzzle), testPuzzle[0][1]);
      done();
   })
});
