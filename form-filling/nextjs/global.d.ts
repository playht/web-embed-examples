declare global {
  interface Window {
    PlayAI: {
      open: (id: string, options?: any) => void;
      // Add other methods or properties of PlayAI if needed
    };
  }
}

export {};
