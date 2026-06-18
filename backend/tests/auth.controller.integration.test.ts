import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
  seedAdmin,
} from "../src/controllers/authController";
import User from "../src/models/User";
import RefreshToken from "../src/models/RefreshToken";
import {
  generateRefreshTokenPair,
  parseRefreshToken,
} from "../src/utils/generateToken";
import bcrypt from "bcryptjs";

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
  afterEach(() => {
    delete process.env.ADMIN_CREATE_SECRET;
  });

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

  it("register rejects duplicates and protected roles without the admin secret", async () => {
    const first = makeRes();
    await register(makeReq(user) as any, first as any);
    expect(first._get().statusCode).toBe(201);

    const duplicate = makeRes();
    await register(makeReq(user) as any, duplicate as any);
    expect(duplicate._get().statusCode).toBe(400);

    const protectedRole = makeRes();
    await register(
      makeReq({
        name: "Admin User",
        email: "admin@example.com",
        password: "passw0rd",
        role: "admin",
      }) as any,
      protectedRole as any,
    );
    expect(protectedRole._get().statusCode).toBe(403);
  });

  it("register allows protected roles with the admin secret", async () => {
    process.env.ADMIN_CREATE_SECRET = "topsecret";
    const res = makeRes();
    await register(
      makeReq({
        name: "Admin User",
        email: "admin@example.com",
        password: "passw0rd",
        role: "admin",
        adminSecret: "topsecret",
      }) as any,
      res as any,
    );
    const out = res._get();
    expect(out.statusCode).toBe(201);
    expect(out.body.data.role).toBe("admin");
  });

  it("login rejects missing users and incorrect passwords", async () => {
    const missing = makeRes();
    await login(
      makeReq({ email: "missing@example.com", password: "passw0rd" }) as any,
      missing as any,
    );
    expect(missing._get().statusCode).toBe(401);

    await User.create(user);
    const wrongPassword = makeRes();
    await login(
      makeReq({ email: user.email, password: "wrongpass" }) as any,
      wrongPassword as any,
    );
    expect(wrongPassword._get().statusCode).toBe(401);
  });

  it("refreshToken rejects invalid refresh token requests", async () => {
    const missing = makeRes();
    await refreshToken(makeReq({}) as any, missing as any);
    expect(missing._get().statusCode).toBe(400);

    const badFormat = makeRes();
    await refreshToken(
      makeReq({ refreshToken: "not-a-refresh-token" }) as any,
      badFormat as any,
    );
    expect(badFormat._get().statusCode).toBe(401);

    const unknown = makeRes();
    await refreshToken(
      makeReq({ refreshToken: generateRefreshTokenPair().token }) as any,
      unknown as any,
    );
    expect(unknown._get().statusCode).toBe(401);
  });

  it("refreshToken rejects expired and mismatched token secrets", async () => {
    const storedUser = await User.create(user);
    const expiredPair = generateRefreshTokenPair();
    const expiredParsed = parseRefreshToken(expiredPair.token)!;
    await RefreshToken.create({
      user: storedUser._id,
      tokenId: expiredParsed.tokenId,
      tokenHash: await bcrypt.hash(expiredParsed.tokenSecret, 10),
      expiresAt: new Date(Date.now() - 1000),
    });

    const expired = makeRes();
    await refreshToken(
      makeReq({ refreshToken: expiredPair.token }) as any,
      expired as any,
    );
    expect(expired._get().statusCode).toBe(401);

    const mismatchPair = generateRefreshTokenPair();
    const mismatchParsed = parseRefreshToken(mismatchPair.token)!;
    await RefreshToken.create({
      user: storedUser._id,
      tokenId: mismatchParsed.tokenId,
      tokenHash: await bcrypt.hash("different-secret", 10),
      expiresAt: new Date(Date.now() + 60_000),
    });

    const mismatch = makeRes();
    await refreshToken(
      makeReq({ refreshToken: mismatchPair.token }) as any,
      mismatch as any,
    );
    expect(mismatch._get().statusCode).toBe(401);
  });

  it("logout handles missing and malformed refresh tokens", async () => {
    const missing = makeRes();
    await logout(makeReq({}) as any, missing as any);
    expect(missing._get().statusCode).toBe(400);

    const malformed = makeRes();
    await logout(
      makeReq({ refreshToken: "not-a-refresh-token" }) as any,
      malformed as any,
    );
    expect(malformed._get().statusCode).toBe(200);
  });

  it("seedAdmin validates required fields and returns existing users", async () => {
    process.env.ADMIN_CREATE_SECRET = "topsecret";

    const missingEmail = makeRes();
    await seedAdmin(
      makeReq({ password: "seedpass", secret: "topsecret" }) as any,
      missingEmail as any,
    );
    expect(missingEmail._get().statusCode).toBe(400);

    const create = makeRes();
    await seedAdmin(
      makeReq({
        email: "existing@example.com",
        password: "seedpass",
        secret: "topsecret",
      }) as any,
      create as any,
    );
    expect(create._get().statusCode).toBe(201);
    expect(create._get().body.data.name).toBe("Seed Admin");

    const existing = makeRes();
    await seedAdmin(
      makeReq({
        email: "existing@example.com",
        password: "seedpass",
        secret: "topsecret",
      }) as any,
      existing as any,
    );
    expect(existing._get().statusCode).toBe(200);
  });
});
