export interface GeneratedListing {
  title: string;
  price: string;
  description: string;
  imageSuggestions: string[];
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface GenerationResult {
  listing: GeneratedListing;
  sources: GroundingSource[];
}
