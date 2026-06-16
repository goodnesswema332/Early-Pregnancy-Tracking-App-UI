import { generateRefreshTokenPair, parseRefreshToken } from '../src/utils/generateToken';

describe('generateToken utilities', () => {
  it('generates a refresh token pair with proper format', () => {
    const pair: any = generateRefreshTokenPair();
    expect(pair).toHaveProperty('token');
    expect(typeof pair.token).toBe('string');
    const parsed = parseRefreshToken(pair.token);
    expect(parsed).not.toBeNull();
    expect((parsed as any).tokenId).toBe(pair.tokenId);
  });
});
