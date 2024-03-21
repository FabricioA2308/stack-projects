import sinon from "sinon";
import { expect } from "chai";
import User from "../models/user.js";
import AuthController from "../controllers/auth.js";
import FeedController from "../controllers/feed.js";
import { connect, disconnect } from "mongoose";

describe("Auth Controller", () => {
  before(async (done) => {
    connect("placeholder/test-messages");
    const user = new User({
      email: "test@test.com",
      password: "tester",
      name: "Test",
      posts: [],
      _id: "5c0f66b979af55031b34728a",
    });

    await user.save().then(() => {
      done();
    });
  });

  it("should throw an error with code 500 if accessing the database fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "teste",
      },
    };

    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
    });
    User.findOne.restore();
  });

  it("should send a response with a valid user status for an existing user", (done) => {
    const user = new User({
      email: "test@test.com",
      password: "tester",
      name: "Test",
      posts: [],
      _id: "5c0f66b979af55031b34728a",
    });

    return user.save().then(() => {
      const req = { userId: "5c0f66b979af55031b34728a" };
      const res = {
        statusCode: 500,
        userStatus: null,
        status: (code) => {
          this.statusCode = code;
          return this;
        },
        json: (data) => {
          this.userStatus = data.status;
        },
      };
      FeedController.getStatus(req, res, () => {}).then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("I am new!");
      });
    });
  });

  after((done) => {
    User.deleteMany({})
      .then(() => {
        return disconnect();
      })
      .then(() => done());
  });
});
