import Student from '../models/studentModels.js';
import Employed from '../models/employedModels.js';
import UnEmployed from '../models/unemployedModels.js';
import Retired from '../models/retiredModels.js';
import GuestUser from '../models/guestUserModels.js';

const generatePrompt = async (user) => {
  try {
    if (!user) throw new Error('User not found');

    const { _id: userId, userType } = user;
    let profile;

    // Fetch profile based on userType
    const modelMap = {
      student: Student,
      employed: Employed,
      unemployed: UnEmployed,
      retired: Retired,
      guest: GuestUser
    };

    const Model = modelMap[userType];
    if (!Model) throw new Error('Invalid user type');

    profile = await Model.findOne({ userId });
    if (!profile) throw new Error('Profile not found');

    // Extract only essential fields to minimize tokens
    const essentialData = extractEssentialFields(profile, userType);

    return buildOptimizedPrompt(userType, essentialData);
  } catch (error) {
    console.error('Error generating prompt:', error.message);
    return 'Error: Unable to generate financial advice prompt.';
  }
};

const extractEssentialFields = (profile, userType) => {
  const common = {
    age: profile.age,
    income: profile.monthlyIncome || profile.income,
    expenses: profile.monthlyExpenses || profile.expenses,
    savings: profile.currentSavings,
    debt: profile.totalDebt || profile.debt,
    goals: profile.financialGoals
  };

  // Type-specific fields
  const typeSpecific = {
    student: {
      education: profile.educationLevel,
      loans: profile.studentLoans,
      graduation: profile.expectedGraduation
    },
    employed: {
      job: profile.jobTitle,
      experience: profile.workExperience,
      retirement: profile.retirementContributions
    },
    unemployed: {
      lastEmployed: profile.lastEmployed,
      benefits: profile.unemploymentBenefits,
      jobSeeking: profile.jobSeekingStatus
    },
    retired: {
      pension: profile.pensionIncome,
      socialSecurity: profile.socialSecurityIncome,
      healthcare: profile.healthcareCosts
    },
    guest: {
      interests: profile.financialInterests
    }
  };

  return { ...common, ...typeSpecific[userType] };
};

const buildOptimizedPrompt = (userType, data) => {
  // Remove null/undefined values to save tokens
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value != null && value !== '')
  );

  return `Generate personalized financial advice for a ${userType}.

DATA:
${Object.entries(cleanData).map(([key, value]) => `• ${key}: ${value}`).join('\n')}

REQUIREMENTS:
• Provide 5-7 specific, actionable recommendations
• Focus on goal achievement and budget optimization
• Include priority ranking (High/Medium/Low)
• Use bullet points for clarity
• Keep advice practical and measurable

FORMAT:
## Priority Recommendations
• [High] Specific action with timeline
• [Medium] Specific action with timeline
• [Low] Specific action with timeline

## Quick Tips
• Brief practical tips (3-4 items)

Keep response concise and professional.`;
};

export default generatePrompt;