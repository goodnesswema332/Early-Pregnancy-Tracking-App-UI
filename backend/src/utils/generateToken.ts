import jwt from "jsonwebtoken";

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default-secret", {
    expiresIn: "30d",
  });
};
