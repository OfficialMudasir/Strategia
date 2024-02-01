using Newtonsoft.Json;
using Sovren.Models.Resume;
using Strategia.ChatGPT.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Strategia.UserProfiles
{
    public class ChatGPTManager : StrategiaAppServiceBase
    {

        public ChatGPTManager() { }

        public async Task<GPTResponse> Query(string prompt)
        {
            string apiKey = "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";  // Replace with your actual OpenAI API key

            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                var payload = new
                {
                    model = "gpt-4",
                    messages = new[]
                    {
                        new { role = "user", content = prompt }
                    },
                    temperature = 0.2,
                    max_tokens = 1000,
                    frequency_penalty = 0.0,
                };

                var jsonPayload = JsonConvert.SerializeObject(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                     
                    GPTResponse result = JsonConvert.DeserializeObject<GPTResponse>(responseString);
                    return result;

                }
                else
                {
                    Console.WriteLine($"Failed to call the API. Response: {responseString}");
                    return null;
                }
            }
        }

    }

}
