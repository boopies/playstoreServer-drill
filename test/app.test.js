const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
      return supertest(app)
        .get('/apps')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf.at.least(1);
              const apps = res.body[0];
            expect(apps).to.include.all.keys(
                'App', 'Rating', 'Genres'
            );
        });
    });

    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
          .get('/apps')
          .query({ sort: 'MISTAKE' })
          .expect(400, 'Sort must be one of App or Rating');
      });
      
      it('should sort by Rating', () => {
        return supertest(app)
          .get('/apps')
          .query({ sort: 'Rating' })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).to.be.an('array');
            let sorted = true;
    
            let i = 0;
            // iterate once less than the length of the array
            // because we're comparing 2 items in the array at a time
            while (i < res.body.length - 1) {
              // compare book at `i` with next book at `i + 1`
              const appAtI = res.body[i];
              const appAtIPlus1 = res.body[i + 1];
              // if the next book is less than the book at i,
              if (appAtIPlus1.Rating < appAtI.Rating) {
                // the books were not sorted correctly
                sorted = false;
                break; // exit the loop
              }
              i++;
            }
            expect(sorted).to.be.true;
          });
      });

      it('should be 400 if Genre is incorrect', () => {
        return supertest(app)
          .get('/apps')
          .query({ genres: 'MISTAKE' })
          .expect(400, 'Filter must have a value of Action, Puzzle. Strategy, Casual, Arcade, or Card');
      });

      it('should filter results by Action genre', () =>{
      return supertest(app)
        .get('/apps')
        .query({ genres: 'Action'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then( res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const apps = res.body[2];
                expect(apps.Genres).to.have.string('Action');
        });
      });

});