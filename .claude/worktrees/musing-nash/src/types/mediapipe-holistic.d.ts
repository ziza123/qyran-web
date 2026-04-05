interface HolisticConfig {
  locateFile: (file: string) => string;
}

interface HolisticResults {
  poseLandmarks?: Array<{ x: number; y: number; z: number; visibility?: number }>;
  faceLandmarks?: Array<{ x: number; y: number; z: number }>;
  leftHandLandmarks?: Array<{ x: number; y: number; z: number }>;
  rightHandLandmarks?: Array<{ x: number; y: number; z: number }>;
}

declare class Holistic {
  constructor(config: HolisticConfig);
  setOptions(options: Record<string, unknown>): void;
  onResults(callback: (results: HolisticResults) => void): void;
  send(input: { image: HTMLVideoElement }): Promise<void>;
  close(): void;
}

interface Window {
  Holistic: typeof Holistic;
}
