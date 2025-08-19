import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env.GITHUB_TOKEN as string;
const endpoint = "https://models.github.ai/inference";

const modelMap: Record<string, string> = {
    gpt: "openai/gpt-4.1",
    llama: "meta/Llama-4-Scout-17B-16E-Instruct",
    grok: "xai/grok-3",
    deepseek: "deepseek/DeepSeek-V3-0324",
    mistral: "mistral-ai/mistral-medium-2505"
  };

export const getSummary = async (aiResponses:object) => {
  const client = ModelClient(endpoint, new AzureKeyCredential(token));
  const summaries: Record<string, string> = {};


  for (const [key, value] of Object.entries(aiResponses)) {
    await new Promise (resolve => setTimeout(resolve, 5000));
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: "" },
          { role: "user", content: `give me an in detail summary for ${value}`}
        ],
        temperature: 0.8,
        top_p: 0.1,
        max_tokens: 2048,
        model: modelMap[key]
      }
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    const content = response.body.choices[0].message.content;
    // console.log(`[${model}]: ${content}`);

    summaries[key] = response.body.choices[0].message.content as string
  }

  return summaries
};

getSummary({}).catch((err) => {
  console.error("The sample encountered an error:", err);
});
