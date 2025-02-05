import morgan from "morgan";
import express from "express";
import request from "supertest";
import assert from 'assert';
import mongoose from "mongoose";
import { expect } from "chai";

import authRouter from "../routes/authRouter.js";
import usersRouter from "../routes/usersRouter.js";
import complexesRouter from "../routes/complexesRouter.js";
import chatRoomsRouter from "../routes/chatRoomsRouter.js";
import notificationsRouter from "../routes/notificationsRouter.js";
import votingsRouter from "../routes/votingsRouter.js";
import newsChannelRouter from "../routes/newsChannelRouter.js";
import newsRouter from "../routes/NewsRouter.js";
import { readFileSync } from "fs";
import path from "path";
import { homedir } from "os";
// import googleAuthRouter from "../routes/googleAuthRouter.js";

const app = express();

// app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static("upload/images"));
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/complexes", complexesRouter);
app.use("/chat_rooms", chatRoomsRouter);
app.use("/notifications", notificationsRouter);
app.use("/votings", votingsRouter);
app.use("/news_channels", newsChannelRouter);
app.use("/news", newsRouter);

let bearerToken = null;

function getToken(done) {
  request(app)
    .post('/auth/login')
    .send({email: 'Password1@email.com', password: "Password1"})
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      bearerToken = res.body.tokens.accessToken;          
      done();
    });
}

let userID = null;

function getUserID(done) {
  request(app)
    .get('/auth/current')
    .set("Authorization", "Bearer " + bearerToken)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      userID = res.body._id;
      done();
    });
}

describe('Testing routes', () => {
  before(function(done) {
    this.timeout(10000);
    mongoose
      .connect(process.env.DB_HOST)
      .then(() => {
        done();
      })
  })

  describe('Test /auth', () => {
    beforeEach(getToken);

    it("POST /login", function(done) {
      request(app)
        .post('/auth/login')
        .send({email: 'Password1@email.com', password: "Password1"})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("POST /logout", function(done) {
      request(app)
        .post('/auth/logout')
        .send()
        .set("Authorization", "Bearer " + bearerToken)
        .expect(204)
        .end(function(err, res) {          
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("GET /current", function(done) {
      request(app)
        .get('/auth/current')
        .set("Authorization", "Bearer " + bearerToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.all.keys("tokens", "_id", "name", "email",
            "phone", "avatar", "is_admin", "buildings", "tempCode", "tempCodeTime");
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("GET /refresh", function(done) {
      request(app)
        .get('/auth/refresh')
        .set("Authorization", "Bearer " + bearerToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.all.keys("accessToken", "refreshToken");
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("PUT /forgot-password", function(done) {
      request(app)
        .put('/auth/forgot-password')
        .send({ email: "Password1@email.com" })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    it("PUT /update", function(done) {
      request(app)
        .put('/auth/update')
        .send({ email: "Password1@email.com", name: "password2@email.com" })
        .set("Authorization", "Bearer " + bearerToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.name).to.equal('password2@email.com');
          if (err) {
            throw err;
          }
          request(app)
            .put('/auth/update')
            .send({ email: "Password1@email.com", name: "password1@email.com" })
            .set("Authorization", "Bearer " + bearerToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              expect(res.body.name).to.equal('password1@email.com');
              if (err) {
                throw err;
              }
              done();
            });
        });
    });
  })

  describe('Test /complexes', function() {
    before(getToken);

    let complexID = '679d1503432a1455984d8e52';
    it("POST /", function(done) {
      request(app)
        .post('/complexes')
        .field('name', 'Test Complex')
        .field('addresses', ['1', '2', '3a'])
        .attach(readFileSync(path.join(homedir(), 'Downloads/Designer (7).jpeg'), 'utf8'))
        .set('Authorization', 'Bearer ' + bearerToken)
        .expect(403)
        .end(function(err, res) {          
          if (err) {
            throw err;
          }
          if (res.body._id) {
            complexID = res.body._id;
          }
          
          done();
        });
    });

    it("PUT /:complexId", function(done) {
      request(app)
        .put('/complexes' + '/' + complexID)
        .send({
          name: 'Test Complex', 
          images: ['def'],
          buildings: [ 
            { address: "0", apartments: [{ number: 1, entrance: 1 }, { number: 2, entrance: 1 }] },
            { address: "1", apartments: [{ number: 1, entrance: 1 }, { number: 2, entrance: 1 }] } 
          ],
        })
        .set('Authorization', 'Bearer ' + bearerToken)
        .expect(200)
        .end(function(err, res) {          
          if (err) {
            throw err;
          }
          done();
        });
    });
  })



  describe('Test /users', function() {
    before(getToken);
    before(getUserID);

    it("PUT /addresses", function(done) {
      this.timeout(5000);
      request(app)
        .put('/users/addresses')
        .send({
          residential_complex: "Test Complex", building: "0", entrance: 1, apartment: 1,
        })
        .set('Authorization', 'Bearer ' + bearerToken)
        .expect(200)
        .end(function(err, res) {          
          if (err) {
            throw err;
          }
          request(app)
            .put('/users/addresses')
            .send({
              residential_complex: "Test Complex", building: "0", entrance: 1, apartment: 2,
            })
            .set('Authorization', 'Bearer ' + bearerToken)
            .expect(200)
            .end(function(err, res) {          
              if (err) {
                throw err;
              }
              done();
            });
        });
    });
  
    it("PATCH /addresses/:userID", function(done) {
      request(app)
        .patch('/users/addresses/' + userID)
        .query({
          residential_complex: "Test Complex", building: "0", entrance: 1, apartment: 2,
        })
        .set('Authorization', 'Bearer ' + bearerToken)
        .expect(201)
        .end(function(err, res) {          
          if (err) {
            throw err;
          }
          done();
        });
    });
  
    it("PATCH /addresses/:userID/:complexId", function(done) {
      request(app)
        .patch('/users/addresses/' + userID + '/' + '679d1503432a1455984d8e52')
        .query({
          moderator: true
        })
        .set('Authorization', 'Bearer ' + bearerToken)
        .expect(200)
        .end(function(err, res) {          
          if (err) {
            throw err;
          }
          done();
        });
    });
  
    it("DELETE /addresses", function(done) {
      request(app)
        .delete('/users/addresses')
        .send({
          residential_complex: "Test Complex", building: "0", entrance: 1, apartment: 1,
        })
        .set('Authorization', 'Bearer ' + bearerToken)
        .expect(200)
        .end(function(err, res) {          
          if (err) {
            throw err;
          }
          request(app)
            .delete('/users/addresses')
            .send({
              residential_complex: "Test Complex", building: "0", entrance: 1, apartment: 2,
            })
            .set('Authorization', 'Bearer ' + bearerToken)
            .expect(200)
            .end(function(err, res) {          
              if (err) {
                throw err;
              }
              done();
            });
        });
    });
  })
})
