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
// import googleAuthRouter from "../routes/googleAuthRouter.js";

const app = express();

app.use(morgan("tiny"));
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
    beforeEach(getToken);

    it("POST /", function() {
      
    });
  })
})
