export enum ModelTypes {
    GPT = "openai/gpt-4o",
    DEEPSEEK = "z-ai/glm-4.5-air:free",
    MISTRAL = "mistralai/mistral-small-3.2-24b-instruct:free",
    QWEN = "nvidia/llama-3.1-nemotron-ultra-253b-v1:free"
}

export type Message = {
    prompt: string;
    response: string;
};
  