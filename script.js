const questions = [
  {
    question: "O que você gosta de fazer?",
    answer: "Eu gosto de ler e programar."
  },
  {
    question: "Onde você mora?",
    answer: "Eu moro na nuvem."
  },
  {
    question: "Qual é a sua cor favorita?",
    answer: "Minha cor favorita é azul."
  }
];

localStorage.setItem("questions", JSON.stringify(questions));

const storedQuestions = JSON.parse(localStorage.getItem("questions"));

const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const chatOutput = document.querySelector("#chat-output");
const suggestionList = document.querySelector("#suggestion-list");

// Esconde a lista de sugestões
suggestionList.style.display = "none";

chatForm.addEventListener("submit", async function(e) {
  e.preventDefault();

  let foundQuestion = false;

  for (let i = 0; i < storedQuestions.length; i++) {
    if (storedQuestions[i].question.includes(chatInput.value)) {
      chatOutput.innerHTML += `<p><strong>Você:</strong> ${chatInput.value}</p>`;
      chatOutput.innerHTML += `<p><strong>Chatbot:</strong> ${storedQuestions[i].answer}</p>`;
      chatInput.value = "";
      foundQuestion = true;
      break;
    }
  }

  if (!foundQuestion) {
    const prompt = chatInput.value;
    chatOutput.innerHTML += `<p><strong>Você:</strong> ${prompt}</p>`;
    chatInput.value = "";

  const apiKey = "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";
  const endpoint = "https://api.openai.com/v1/engines/davinci-codex/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };
const data = {
  "prompt": prompt + "\n--",
  "max_tokens": 250,
  "temperature": 0.5,
  "n": 20,
  "stop": "\n"
};

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      const result = await response.json();

      const chatbotResponse = result.choices[0].text.trim();
      chatOutput.innerHTML += `<p><strong>Chatbot:</strong> ${chatbotResponse}</p>`;
    } catch (error) {
      console.error(error);
    }
  }
});


// Atualiza a lista de sugestões conforme o usuário digita
chatInput.addEventListener("input", function() {
  suggestionList.innerHTML = "";
  for (let i = 0; i < storedQuestions.length; i++) {
    if (storedQuestions[i].question.toLowerCase().includes(chatInput.value.toLowerCase())) {
      const suggestionItem = document.createElement("li");
      suggestionItem.innerHTML = storedQuestions[i].question;
      suggestionItem.addEventListener("click", function() {
        chatInput.value = storedQuestions[i].question;
        suggestionList.innerHTML = "";
        suggestionList.style.display = "none";
      });
      suggestionList.appendChild(suggestionItem);
    }
  }

  // Mostra a lista de sugestões se houver pelo menos um item
  if (suggestionList.children.length > 0) {
    suggestionList.style.display = "block";
  } else {
    suggestionList.style.display = "none";
  }
});
