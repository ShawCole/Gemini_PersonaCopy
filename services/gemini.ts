import { GoogleGenAI, Type } from "@google/genai";
import { BrandIdentity, Avatar, AssetType, PlatformMode } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to ensure we don't crash if key is missing
const checkApiKey = () => {
  if (!apiKey) throw new Error("API Key is missing. Please check your environment.");
};

export const enhanceAvatarProfile = async (
  basicDescription: string,
  brand: BrandIdentity
): Promise<Omit<Avatar, 'id' | 'name'>> => {
  checkApiKey();

  const prompt = `
    You are a world-class expert in consumer psychology and market research.
    Analyze the following target audience description in the context of this brand:
    
    Brand Name: ${brand.name}
    Product: ${brand.productDescription}
    Audience Note: "${basicDescription}"

    Generate a deep psychographic profile. Focus heavily on 'Deep Analysis'—fears, hidden motivations, and the emotional triggers that drive purchasing decisions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            demographics: {
              type: Type.OBJECT,
              properties: {
                ageRange: { type: Type.STRING },
                gender: { type: Type.STRING },
                location: { type: Type.STRING },
                occupation: { type: Type.STRING },
                incomeLevel: { type: Type.STRING }
              },
              required: ['ageRange', 'location', 'occupation']
            },
            psychographics: {
              type: Type.OBJECT,
              properties: {
                coreValues: { type: Type.ARRAY, items: { type: Type.STRING } },
                hobbies: { type: Type.ARRAY, items: { type: Type.STRING } },
                lifestyle: { type: Type.STRING }
              }
            },
            deepAnalysis: {
              type: Type.OBJECT,
              properties: {
                fears: { type: Type.ARRAY, items: { type: Type.STRING } },
                motivations: { type: Type.ARRAY, items: { type: Type.STRING } },
                painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                objections: { type: Type.ARRAY, items: { type: Type.STRING } },
                dreamOutcome: { type: Type.STRING }
              },
              required: ['fears', 'motivations', 'painPoints', 'dreamOutcome']
            }
          },
          required: ['demographics', 'psychographics', 'deepAnalysis']
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    return json as Omit<Avatar, 'id' | 'name'>;
  } catch (error) {
    console.error("Failed to enhance avatar:", error);
    throw error;
  }
};

export const generateAsset = async (
  assetType: AssetType,
  platformMode: PlatformMode,
  avatar: Avatar,
  brand: BrandIdentity,
  specificInstructions: string
): Promise<string> => {
  checkApiKey();

  // 1. Define the Tri-Modal Ruleset
  const PLATFORM_RULES = {
    'Social Guardian (Meta/TikTok)': `
      INTENT: Disruption Management.
      STRICT CONSTRAINTS:
      - POV LOCK: Third-Person Observational ONLY. Absolutely NO "You/Your" in the first 25% of copy.
      - NOUN FILTERING: Swap "Money" for "Liquidity", "Business" for "Infrastructure", "Work" for "Operational Input".
      - RAW FILTER: Use lower-case, sentence fragments. mimic a "friend's post".
      - BANNED VISUALS: Luxury cars, dashboards, cash, aggressive graphs.
      - REQUIRED VISUALS: Professional desk setting, notebook, calm control, nature/walking.
    `,
    'Commercial Pipeline (DSP/Native)': `
      INTENT: Intent Capture.
      STRICT CONSTRAINTS:
      - MECHANISM FOCUS: Must name a "Unique Mechanism" (e.g. The ${brand.name} Protocol).
      - DIRECT POV: Second-person ("You") is MANDATORY. High relevance.
      - HIGH-STAKES AGITATION: Use clinical, harsh data to prove the "Old Model" is dying.
      - BANNED VISUALS: Soft/vague lifestyle imagery.
      - REQUIRED VISUALS: High-contrast dashboards, comparative graphs, "Red vs Green" charts.
    `,
    'Safe-Haven (VSL/Owned)': `
      INTENT: Conversion & Trust.
      STRICT CONSTRAINTS:
      - THE ASSASSIN PIVOT: Start in "Social Guardian" mode (Safe/Observational) for the first 30%. Pivot to "Commercial Pipeline" (Direct Offer) at the 30% mark.
      - SCENT CONSISTENCY: The first sentence must match the "Hook" of the Ad logic.
      - VISUAL FLOW: Start with Narrative/Hero visuals -> Pivot to Logic/Data visuals.
    `
  };

  const selectedRules = PLATFORM_RULES[platformMode];

  // 2. Build the System Instruction
  const systemInstruction = `
    You are an advanced "Platform-Aware" Copy Generation Engine (Model 2026).
    
    YOUR MODE: ${platformMode}
    
    ${selectedRules}

    GENERAL RULES:
    1. AGENCY ANCHOR: Every piece of copy must end with a "Choice" not a "Command". 
       - Bad: "Sign up now."
       - Good: "The data is here. It’s up to the professional to decide if the math aligns with their goals."
    
    2. SENTIMENT SCRAPER SIMULATION:
       - If you write something too aggressive (e.g., "You will fail"), auto-correct it to be observational ("Statistical failure rates are high").
       - Act as your own compliance officer.

    3. VISUAL-COPY SYNC:
       - You MUST output a "Visual Directive" block at the top of the content.
       - IF copy touches on "Financial Independence" AND platform is "Social Guardian", enforce "Desk setting/Notebook" visuals.
  `;

  // 3. Build the User Prompt
  const prompt = `
    GENERATE: ${assetType}
    PLATFORM: ${platformMode}
    
    BRAND IDENTITY:
    Name: ${brand.name}
    Mission: ${brand.mission}
    Tone: ${brand.toneOfVoice}
    USP: ${brand.uniqueSellingPoints.join(', ')}

    TARGET AVATAR (${avatar.name}):
    - Dream Outcome: ${avatar.deepAnalysis.dreamOutcome}
    - Fears: ${avatar.deepAnalysis.fears.join(', ')}
    - Motivations: ${avatar.deepAnalysis.motivations.join(', ')}

    SPECIFIC INSTRUCTIONS:
    ${specificInstructions}

    OUTPUT FORMAT:
    1. [VISUAL DIRECTIVE]: A specific instruction for the creative team on what image/video matches this copy compliance level.
    2. [PLATFORM CHECK]: A brief bullet list confirming how you met the specific mode constraints (e.g. "Swapped 'Money' for 'Liquidity'").
    3. [THE ASSET]: The actual copy/script.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 2048 } 
      }
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Failed to generate asset:", error);
    throw error;
  }
};