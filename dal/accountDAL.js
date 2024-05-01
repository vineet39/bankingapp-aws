import User from "../models/User.js";

export const deposit = async (accountNumber, amount) => {
  try {
    if (!accountNumber || amount <= 0) {
      return {
        status: 400,
        message: "Invalid account number/amount",
        user: null,
        error: null,
      };
    }

    const user = await User.findOneAndUpdate(
      { accountNumber: accountNumber },
      { $inc: { balance: amount } },
      { new: true, projection: "-password" }
    );

    if (!user) {
      return {
        status: 404,
        message: "Account not found",
        user: null,
        error: null,
      };
    }

    return { status: 200, message: "Deposit successful", user, error: null };
  } catch (error) {
    return { status: 500, message: "Internal server error", user: null, error };
  }
};

export const withdraw = async (accountNumber, amount) => {
  try {
    if (!accountNumber || amount <= 0) {
      return {
        status: 400,
        message: "Invalid account number/amount",
        user: null,
        error: null,
      };
    }

    const user = await User.findOne({ accountNumber: accountNumber });
    if (!user) {
      return {
        status: 404,
        message: "Account not found",
        user: null,
        error: null,
      };
    }

    if (user.balance < amount) {
        return {
            status: 404,
            message: "Insufficient funds",
            user: null,
            error: null,
          };
    }

    const updatedUser = await User.findOneAndUpdate(
        { accountNumber: accountNumber },
        { $inc: { balance: -amount } },  
        { new: true, projection: '-password' }
    );

    return { status: 200, message: "Withdraw successful", user:updatedUser, error: null };
  } catch (error) {
    return { status: 500, message: "Internal server error", user: null, error };
  }
};
