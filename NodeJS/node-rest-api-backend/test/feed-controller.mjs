import { expect } from "chai";
import User from "../models/user.js";
import { connect, disconnect } from "mongoose";
import FeedController from "../controllers/feed.js";

describe("Feed Controller", async () => {
  before((done) => {
    connect("placeholder/test-messages");
  });
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

  it("should add a created post to the posts of the creator", (done) => {
    const req = {
      file: {
        path: "images",
      },
      body: {
        title: "Title",
        content: "Content test",
      },
      userId: "5c0f66b979af55031b34728a",
    };
  
    const res = {
      status: () => {
        return this;
      },
      json: () => {},
    };
  
    FeedController.postNewPosts(req, res, () => {}).then((user) => {
      expect(user).to.have.property("posts");
      expect(user.posts).to.have.length(1);
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
