import mongoose from 'mongoose';

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    tokenType: {
      type: String,
      enum: ['access', 'refresh'],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      enum: ['logout', 'password_change', 'account_deletion', 'security', 'expired'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

tokenBlacklistSchema.index({ token: 1 });
tokenBlacklistSchema.index({ user: 1 });
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

tokenBlacklistSchema.statics.isBlacklisted = async function (token) {
  const found = await this.findOne({ token });
  return !!found;
};

tokenBlacklistSchema.statics.addToBlacklist = async function (token, tokenType, userId, reason, expiresAt) {
  return await this.create({
    token,
    tokenType,
    user: userId,
    reason,
    expiresAt,
  });
};

tokenBlacklistSchema.statics.removeExpired = async function () {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
  return result.deletedCount;
};

export default mongoose.model('TokenBlacklist', tokenBlacklistSchema);
