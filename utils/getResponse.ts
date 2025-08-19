import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env.GITHUB_TOKEN as string;
const endpoint = "https://models.github.ai/inference";

const models = [
  "openai/gpt-4.1",
  "meta/Llama-4-Scout-17B-16E-Instruct",
  "xai/grok-3",
  "deepseek/DeepSeek-V3-0324",
  "mistral-ai/mistral-medium-2505"
];

export const main = async (prompt: string) => {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));

  let gpt = "";
  let llama = "";
  let grok = "";
  let deepseek = "";
  let mistral = ""

  for (const model of models) {
    await new Promise (resolve => setTimeout(resolve, 5000));
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: "" },
          { role: "user", content: prompt}
        ],
        temperature: 0.8,
        top_p: 0.1,
        max_tokens: 2048,
        model: model
      }
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    const content = response.body.choices[0].message.content;
    console.log(`[${model}]: ${content}`);

    if (model.includes("gpt-4")) {
      gpt += content;
    } else if (model.includes("Llama")) {
      llama += content;
    } else if (model.includes("grok")) {
      grok += content;
    } else if (model.includes("deepseek")) {
      deepseek += content;
    } else if(model.includes("mistral")) {
      mistral += content;
    }
  }

  return { gpt, llama, grok, deepseek, mistral };
};

main("").catch((err) => {
  console.error("The sample encountered an error:", err);
});
