import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import api from "../src/services/api";

jest.mock("@react-native-async-storage/async-storage", () => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn(async (key: string) => store[key] ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn(async (key: string) => {
      delete store[key];
    }),
  };
});

const AsyncStorage = require("@react-native-async-storage/async-storage");

describe("mobile api interceptor", () => {
  let mockApi: MockAdapter;
  let mockGlobal: MockAdapter;

  beforeEach(async () => {
    mockApi = new MockAdapter(api);
    mockGlobal = new MockAdapter(axios);
    // Use a local store and wire AsyncStorage mock implementations to it
    const store: Record<string, string> = {};
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      async (key: string) => store[key] ?? null,
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      async (key: string, value: string) => {
        store[key] = value;
      },
    );
    (AsyncStorage.removeItem as jest.Mock).mockImplementation(
      async (key: string) => {
        delete store[key];
      },
    );
    // initialize
    await AsyncStorage.setItem("accessToken", "old-token");
    await AsyncStorage.setItem("refreshToken", "refresh-token");
    // clear call history so assertions later only see calls made during the test
    (AsyncStorage.setItem as jest.Mock).mockClear();
    (AsyncStorage.removeItem as jest.Mock).mockClear();
  });

  afterEach(() => {
    mockApi.restore();
    mockGlobal.restore();
    jest.resetAllMocks();
  });

  it("attaches access token to requests", async () => {
    mockApi.onGet("/test").reply((config) => {
      return [200, { ok: true, authHeader: config.headers?.Authorization }];
    });

    const res = await api.get("/test");
    expect(res.status).toBe(200);
    expect(res.data.authHeader).toBe("Bearer old-token");
  });

  it("refreshes token on 401 and retries original request", async () => {
    // First protected request returns 401
    // Stateful handler: first call returns 401, second returns 200 with the received Authorization header
    let callCount = 0;
    mockApi.onGet("/protected").reply((config) => {
      callCount += 1;
      if (callCount === 1) return [401, {}];
      // debug headers
      // eslint-disable-next-line no-console
      console.log("mock handler received headers", config.headers);
      return [
        200,
        {
          ok: true,
          authHeader:
            config.headers?.Authorization || config.headers?.authorization,
        },
      ];
    });

    // Refresh endpoint on global axios
    mockGlobal.onPost().reply((config) => {
      if (config.url && config.url.includes("/auth/refresh")) {
        return [
          200,
          { data: { accessToken: "new-token", refreshToken: "new-refresh" } },
        ];
      }
      return [404, {}];
    });

    const res = await api.get("/protected");
    expect(res.status).toBe(200);
    expect(res.data.authHeader).toBe("Bearer new-token");
    // ensure AsyncStorage updated with new tokens
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      "new-token",
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "refreshToken",
      "new-refresh",
    );
  });
});
