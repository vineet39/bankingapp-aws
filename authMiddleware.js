import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  let status = 401;
  let error = "Missing authentication";
  let message = "Missing authentication";
  let data = null;

  if (token == null)
    return res.status(status).json({ data, message, error });

  jwt.verify(token, process.env.JWT_SECRET, (err, accountNumber) => {
    if (err) {
      let status = 403;
      let error = "Invalid token";
      let message = "Invalid token";
      let data = null;
      return res.status(status).json({ data, message, error });
    }
    req.accountNumber = accountNumber;
    next();
  });
};


