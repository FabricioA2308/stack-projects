import isAuth from "../middleware/is-auth.js";
import jwt from "jsonwebtoken";
import sinon from "sinon";
import { expect } from "chai";

describe("Auth middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: () => {
        return null;
      },
    };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw("Not authenticated");
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: () => {
        return "xyz";
      },
    };

    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a object with userId after decoding the token", () => {
    const req = {
      get: (headerName) => {
        return "Bearer dioasjdoiasjdiaso";
      },
    };

    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });

    isAuth(req, {}, () => {});
    expect(req).to.have.property("userId");
    jwt.verify.restore();
  });
});
