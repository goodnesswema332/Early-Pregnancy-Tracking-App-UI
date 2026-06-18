import {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshTokenPair,
  parseRefreshToken,
} from "../src/utils/generateToken";

describe("generateToken utilities", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  describe("generateAccessToken", () => {
    it("generates a valid JWT token", () => {
      const token = generateAccessToken("user123");
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("generates different tokens for different users", () => {
      const token1 = generateAccessToken("user1");
      const token2 = generateAccessToken("user2");
      expect(token1).not.toBe(token2);
    });
  });

  describe("verifyAccessToken", () => {
    it("verifies a valid token and returns decoded payload", () => {
      const token = generateAccessToken("user123");
      const decoded = verifyAccessToken(token);
      expect(decoded.id).toBe("user123");
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it("throws error for invalid token", () => {
      expect(() => verifyAccessToken("invalid-token")).toThrow();
    });
  });

  describe("generateRefreshTokenPair", () => {
    it("generates a refresh token pair with proper format", () => {
      const pair = generateRefreshTokenPair();
      expect(pair).toHaveProperty("tokenId");
      expect(pair).toHaveProperty("tokenSecret");
      expect(pair).toHaveProperty("token");
      expect(pair).toHaveProperty("expiresAt");
      expect(typeof pair.tokenId).toBe("string");
      expect(typeof pair.tokenSecret).toBe("string");
      expect(typeof pair.token).toBe("string");
      expect(pair.expiresAt).toBeInstanceOf(Date);
    });

    it("generates unique token pairs each time", () => {
      const pair1 = generateRefreshTokenPair();
      const pair2 = generateRefreshTokenPair();
      expect(pair1.token).not.toBe(pair2.token);
      expect(pair1.tokenId).not.toBe(pair2.tokenId);
    });

    it("token is formatted as tokenId.tokenSecret", () => {
      const pair = generateRefreshTokenPair();
      expect(pair.token).toBe(`${pair.tokenId}.${pair.tokenSecret}`);
    });
  });

  describe("parseRefreshToken", () => {
    it("parses a valid refresh token", () => {
      const pair = generateRefreshTokenPair();
      const parsed = parseRefreshToken(pair.token);
      expect(parsed).not.toBeNull();
      expect(parsed!.tokenId).toBe(pair.tokenId);
      expect(parsed!.tokenSecret).toBe(pair.tokenSecret);
    });

    it("returns null for invalid format", () => {
      expect(parseRefreshToken("invalid")).toBeNull();
      expect(parseRefreshToken("")).toBeNull();
      expect(parseRefreshToken("too.many.parts.here")).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(parseRefreshToken("")).toBeNull();
    });
  });
});
