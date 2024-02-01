using System;
using System.Collections.Generic;
using System.Text;

namespace Strategia.ChatGPT.Dtos
{

    public class GPTResponse
    {
        public string Id { get; set; }
        public string Model { get; set; }
        public List<Choice> Choices { get; set; }
    }

    public class Choice
    {
        public string Text { get; set; }
        public string Index { get; set; }
        public double Logprobs { get; set; }
        public string FinishReason { get; set; }
    }
}
