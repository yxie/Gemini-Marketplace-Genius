import { GoogleGenAI } from "@google/genai";
import { GenerationResult, GeneratedListing, GroundingSource } from "../types";

const parseResponse = (text: string): GeneratedListing => {
  const titleMatch = text.match(/##\s*Title\s*\n([\s\S]*?)(?=\n##|$)/i);
  const priceMatch = text.match(/##\s*Price\s*\n([\s\S]*?)(?=\n##|$)/i);
  const descMatch = text.match(/##\s*Description\s*\n([\s\S]*?)(?=\n##|$)/i);
  const imagesMatch = text.match(/##\s*Image Suggestions\s*\n([\s\S]*?)(?=\n##|$)/i);

  const clean = (str: string | undefined) => str ? str.trim() : "";

  // Extract URLs from the Image Suggestions section
  const imageText = clean(imagesMatch?.[1]);
  const imageSuggestions = imageText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('http'));

  return {
    title: clean(titleMatch?.[1]),
    price: clean(priceMatch?.[1]),
    description: clean(descMatch?.[1]),
    imageSuggestions: imageSuggestions
  };
};

export const generateListingContent = async (keywords: string): Promise<GenerationResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    I assist a user in selling a USED product on Facebook Marketplace. The item is: "${keywords}".
    
    Step 1: SEARCH EXTENSIVELY for current *used* listings on **Mercari**, **eBay**, and **Facebook Marketplace** to determine the market value. It is CRITICAL to find and use data from these specific resale sites.
    Step 2: Search for official product details and images.
    
    Based on your research, generate a selling post following these strict guidelines:
    
    ## Title
    Write a concise, attractive title suitable for a marketplace listing.
    
    ## Price
    Provide ONLY the estimated resale price or range (e.g., "$150 - $200") based on the used market data found (Mercari, FB Marketplace, etc). Do NOT include any text about "trending on", "based on", or source names. Just the numbers.
    
    ## Description
    Write a simple, helpful description.
    Structure:
    - **Intro**: A friendly sentence about the item.
    - **User Experience**: Briefly describe why this product is good to use.
    - **Key Features**: 3-4 essential specs in bullet points.
    - **Condition**: [Describe condition here: e.g., lightly used, like new, any scratches?]
    - **Closing**: A simple "Message me if interested!"
    
    ## Image Suggestions
    Find direct image URLs specifically from the official brand website or major authorized retailers. Avoid user-uploaded photos or generic stock photos if possible. List the raw image URLs, one per line. If none are directly accessible, leave this section empty.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract grounding sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title
          });
        }
      });
    }

    const listing = parseResponse(text);

    return {
      listing,
      sources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with the AI service.");
  }
};