import mongoose from "mongoose";

const GuestUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  currentStatus: {
    type: String,
    enum: ['student', 'employed', 'unemployed', 'retired', 'exploring'],
    required: true
  },
  monthlyIncome: Number,
  financialGoal: [{
    name: { type: String,},
    targetAmount: { type: Number,},
    currentAmount: { type: Number, default: 0 },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }],
  summaryFrequency: {
    type: String,
    enum: ['weekly', 'monthly', 'never'],
    default: 'never'
  },
  helpPreferences: [{
    type: String,
    enum: ['budget', 'debt', 'savings', 'jobSearch', 'investing', 'retirement']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const GuestModel = mongoose.model('GuestUser', GuestUserSchema);
export default GuestModel;
