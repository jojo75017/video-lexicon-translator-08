
export interface DalleGenerationResponse {
  created: number;
  data: {
    url: string;
  }[];
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  date: Date;
  size?: string;
}

export interface ImageGenerationOptions {
  prompt: string;
  size: '256x256' | '512x512' | '1024x1024';
  n?: number;
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  response_format?: 'url' | 'b64_json';
}
