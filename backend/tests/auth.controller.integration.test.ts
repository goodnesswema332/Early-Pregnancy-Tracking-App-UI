import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
  seedAdmin,
} from "../src/controllers/authController";
import User from "../src/models/User";

function makeReq(body: any = {}, user: any = undefined) {
  return { body, user } as any;
}

function makeRes() {
  let statusCode = 200;
  let jsonBody: any = null;
  return {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(obj: any) {
      jsonBody = obj;
      return { statusCode, body: jsonBody };
    },
    _get() {
      return { statusCode, body: jsonBody };
    },
  } as any;
}

describe("Auth controller integration (direct)", () => {
  const user = {
    name: "Ctrl User",
    email: "ctrl@example.com",
    password: "passw0rd",
  };

  it("register -> login -> getMe -> refresh -> logout", async () => {
    const reqReg = makeReq(user);
    const resReg = makeRes();
    await register(reqReg, resReg);
    const outReg = (resReg as any)._get();
    expect(outReg.statusCode).toBe(201);
    expect(outReg.body.success).toBe(true);
    const _accessToken = outReg.body.data.accessToken;
    const refresh = outReg.body.data.refreshToken;

    // login
    const reqLogin = makeReq({ email: user.email, password: user.password });
    const resLogin = makeRes();
    await login(reqLogin, resLogin);
    const outLogin = resLogin._get();
    expect(outLogin.statusCode).toBe(200);
    expect(outLogin.body.success).toBe(true);

    // getMe requires req.user to be set (simulate protect middleware)
    const stored = await User.findOne({ email: user.email });
    const reqMe = makeReq({}, { _id: stored!._id });
    const resMe = makeRes();
    await getMe(reqMe as any, resMe as any);
    const outMe = resMe._get();
    expect(outMe.statusCode).toBe(200);
    expect(outMe.body.data.email).toBe(user.email);

    // refresh - use refresh token from login response
    const tokenFromLogin = outLogin.body.data.refreshToken || refresh;
    const reqRefresh = makeReq({ refreshToken: tokenFromLogin });
    const resRefresh = makeRes();
    await refreshToken(reqRefresh as any, resRefresh as any);
    const outRefresh = resRefresh._get();
    expect(outRefresh.statusCode).toBe(200);
    expect(outRefresh.body.success).toBe(true);

    // logout
    const reqLogout = makeReq({
      refreshToken: outRefresh.body.data.refreshToken,
    });
    const resLogout = makeRes();
    await logout(reqLogout as any, resLogout as any);
    const outLogout = resLogout._get();
    expect(outLogout.statusCode).toBe(200);
  });

  it("seedAdmin requires secret and creates super", async () => {
    const res = makeRes();
    const req = makeReq({
      name: "Seed",
      email: "seed@example.com",
      password: "seedpass",
      secret: "wrong",
    });
    await seedAdmin(req as any, res as any);
    const out = res._get();
    expect(out.statusCode).toBe(403);

    process.env.ADMIN_CREATE_SECRET = "topsecret";
    const res2 = makeRes();
    const req2 = makeReq({
      name: "Seed",
      email: "seed2@example.com",
      password: "seedpass",
      secret: "topsecret",
    });
    await seedAdmin(req2 as any, res2 as any);
    const out2 = res2._get();
    expect([200, 201]).toContain(out2.statusCode);
  });
});
