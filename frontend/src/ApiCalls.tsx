const getMutation = async (values) => {
  const ret = await fetch("http://localhost:8000/api/mutate/", {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((err) => {
      alert(err.message);
    });
  return ret.mutatedPrompt;
}

async function getLLMResponse(prompt, model, config) {
  const ret = await fetch("http://localhost:8000/api/llm/", {
    method: 'POST',
    body: JSON.stringify({
      prompt: prompt,
      api: "chat-gpt",
      model: model,
      config: config
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.modelResponse;
    })
    .catch((err) => {
      alert(err.message);
    });
  return ret;
}

const listModels = async () => {
  const ret = await fetch("http://localhost:8000/api/list/", {
    method: "GET",
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then((response) => response.json())
  .then((data) => {
    return data
  })
  .catch((err) => {
    alert(err.message)
  })
  return ret;
};

const getComparisonData = async (history) => {
    const data = await fetch("http://localhost:8000/api/compare/", {
      method: 'POST',
      body: JSON.stringify({
        history: history,
        metrics: ['corpus-bleu', 'rouge-l']
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then((response) => response.json())
      .then((response) => { return response; })
    return data;
  }

export {getLLMResponse, getMutation, listModels, getComparisonData};