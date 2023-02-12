const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const testPuzzle = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
const invalidPuzzle1 = testPuzzle[0][0].replace('5','a');
const invalidPuzzle2 = testPuzzle[0][0].split('').push('1','2');
const invalidPuzzle3 = testPuzzle[0][0].replace('2','6');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done)=>{
        chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: testPuzzle[0][0]})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.solution, testPuzzle[0][1]);
            done();
        });
    });

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done)=>{
        chai
        .request(server)
        .post('/api/solve')
        .send({})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Required field missing');
            done();
        });
    });

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done)=>{
        chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: invalidPuzzle1})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
        });
    });

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done)=>{
        chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: invalidPuzzle2})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
        });
    });
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done)=>{
        chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: invalidPuzzle3})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Puzzle cannot be solved');
            done();
        });
    });
    test('Check a puzzle placement with all fields: POST request to /api/check', (done)=>{
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: testPuzzle[0][0], coordinate: 'a1', value: '1'})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, true);
            done();
        });
    });
    test('Check a puzzle placement with single placement conflicts: POST request to /api/check', (done)=>{
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: testPuzzle[0][0], coordinate: 'a2', value: '9'})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.toString(), 'column');
            done();
        });
    });
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done)=>{
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: testPuzzle[0][0], coordinate: 'b1', value: '3'})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.toString(), 'row,column');
            done();
        });
    });
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done)=>{
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: testPuzzle[0][0], coordinate: 'a2', value: '2'})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false);
            assert.equal(res.body.conflict.toString(), 'row,column,region');
            done();
        });
    });
    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done)=>{
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: testPuzzle[0][0], value: '1'})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Required field(s) missing');
            done();
        });
    });
    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done)=>{
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: invalidPuzzle1, coordinate: 'a2', value: '3'})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
        });
    });
    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done)=>{
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: invalidPuzzle2, coordinate: 'a2', value: '3'})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
        });
    });
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done)=>{
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: testPuzzle[0][0], coordinate: 's2', value: '2'})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid coordinate');
            done();
        });
    });
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done)=>{
        chai
        .request(server)
        .post('/api/check')
        .send({puzzle: testPuzzle[0][0], coordinate: 'a2', value: 's'})
        .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid value');
            done();
        });
    });
    
});

