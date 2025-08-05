
import Student from '../src/models/studentModels.js';
import Employed from '../src/models/employedModels.js';
import UnEmployed from '../src/models/unemployedModels.js';
import Retired from '../src/models/retiredModels.js';
import GuestUser from '../src/models/guestUserModels.js';

const generatePrompt = async (user) => {
  try {
    if (!user) throw new Error('User not found');

    const userId = user._id;
    const userType = user.userType;
    let profile;

    // Only fetch the correct profile based on userType
    if (userType === 'student') {
      profile = await Student.findOne({ userId });
    } else if (userType === 'employed') {
      profile = await Employed.findOne({ userId });
    } else if (userType === 'unemployed') {
      profile = await UnEmployed.findOne({ userId });
    } else if (userType === 'retired') {
      profile = await Retired.findOne({ userId });
    } else if (userType === 'guest') {
      profile = await GuestUser.findOne({ userId });
    }

    if (!profile) throw new Error('Profile not found for this user');

    // Serialize the profile to JSON
    const profileJson = JSON.stringify(profile.toObject(), null, 2);

    // Construct the prompt
    return `
The following is a "${userType}" financial profile. Based on the information, generate personalized, practical, and goal-focused financial advice.

Profile:
${profileJson}

Advice:
- Provide practical, helpful financial tips
- Prioritize goal achievement and budgeting
- Use bullet points where helpful
- Keep tone professional but motivational
    `;
  } catch (error) {
    console.error('Error generating prompt:', error.message);
    return 'Error generating prompt.';
  }
};

export default generatePrompt;
