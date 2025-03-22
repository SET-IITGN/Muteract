// This is a type to ensure TS does not scream.
export interface MutatedPromptContextType {
  originalPrompt: string;
  mutatedPrompt: string;
  setOriginalPrompt: (prompt: string) => void;
  setMutatedPrompt: (prompt: string) => void;
};

// Define all the parameters to be handled by the UI
// and sent to the API here and use the object 
// of this type to sendrequests
export interface ChatGPTConfigContextType {
  outputTokens: number,
  temperature: number,
  topP: number,
  developerMessage: string,
  setTemperature: (input: string, temp: number) => void;
  setOutputTokens: (temp: number) => void;
  setTopP: (input: string, temp: number) => void;
  setDeveloperMessage: (temp: string) => void;
};

// Define all the mutation operators
// ex: "ab" | "bei" ...
// type MutationOptions = "";

// export interface MessageRecord {
//   message: string,
//   direction: MessageDirection,
//   position: MessageModel["position"],
//   config?: ChatGPTConfig,
//   // mutationOptions?: MutationOptions
// };

export interface ChatGPTConfig {
  outputTokens: number,
  temperature: number,
  topP: number,
  developerMessage: string,
}

export interface HistoryRecord {
  prompt: string,
  response: string
  config?: ChatGPTConfig
}
