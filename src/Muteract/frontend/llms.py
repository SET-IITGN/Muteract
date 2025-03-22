import json
from pathlib import Path
from openai import OpenAI
from openai.types.chat import ChatCompletionDeveloperMessageParam, ChatCompletionUserMessageParam, ChatCompletionContentPartTextParam
import os
import sys

CONFIG_DIR = Path(__file__).resolve().parent

config = json.load(open(f"{CONFIG_DIR}/config.json"))

def get_env_var(name: str):
    value = os.environ[name]
    if len(value) == 0:
        raise Exception(f"No environment variable with name: {name}")
    else:
        return value

class ChatGPT:
    class Config:
        def __init__(self):
            self.api_key_var = config['chat-gpt']['api_key_var']
            # self.model = config['chat-gpt']['model']
            # self.temperature = config['chat-gpt']['temperature']
            # self.output_tokens = config['chat-gpt']['max_output_tokens']
            # self.top_p = config['chat-gpt']['top_p']

    def __init__(self, config=Config()):
        self.client = OpenAI(api_key=get_env_var(config.api_key_var))
        self.models_list = [model.id for model in self.client.models.list()]
        # self.config = config

    def get_models(self):
        return self.models_list

    def get_response(self, model, prompt, generation_config):
        response = self.client.chat.completions.create(
            model=model,
            messages=[
                ChatCompletionDeveloperMessageParam(
                    role="developer",
                    content=[
                        ChatCompletionContentPartTextParam(
                            text=generation_config["developerMessage"],
                            type="text"
                        )
                    ]
                ),
                ChatCompletionUserMessageParam(
                    role="user",
                    content=[ChatCompletionContentPartTextParam(
                        text=prompt,
                        type="text"
                    )]
                )
            ],
            max_tokens=generation_config["outputTokens"],
            temperature=generation_config["temperature"],
            top_p=generation_config["topP"],
            seed=None,
        )
        return response.choices[0].message.content
