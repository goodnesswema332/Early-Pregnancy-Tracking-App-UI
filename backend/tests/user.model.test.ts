import User from "../src/models/User";

describe("User Model", () => {
  it("should hash the password before saving", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };
    const user = await User.create(userData);

    expect(user.password).not.toBe("password123");
    const isMatch = await user.comparePassword("password123");
    expect(isMatch).toBe(true);
  });

  it("should correctly compare a candidate password", async () => {
    const user = await User.create({
      name: "Test User 2",
      email: "test2@example.com",
      password: "password123",
    });

    const isMatch = await user.comparePassword("password123");
    expect(isMatch).toBe(true);
  });

  it("should return false for an incorrect password", async () => {
    const user = await User.create({
      name: "Test User 3",
      email: "test3@example.com",
      password: "password123",
    });

    const isMatch = await user.comparePassword("wrongpassword");
    expect(isMatch).toBe(false);
  });

  it("should not modify password if it is not modified", async () => {
    const user = await User.create({
      name: "Test User 4",
      email: "test4@example.com",
      password: "password123",
    });

    const initialPassword = user.password;
    user.name = "Updated User";
    await user.save();

    expect(user.password).toBe(initialPassword);
  });

  it("should have default values for role and progress", async () => {
    const user = await User.create({
      name: "Test User 5",
      email: "test5@example.com",
      password: "password123",
    });

    expect(user.role).toBe("user");
    expect(user.progress.modulesCompleted).toBe(0);
    expect(user.progress.totalModules).toBe(12);
    expect(user.progress.badgesEarned).toEqual([]);
    expect(user.progress.streak).toBe(0);
    expect(user.progress.lastActive).toBeInstanceOf(Date);
    expect(user.createdAt).toBeInstanceOf(Date);
  });
});
