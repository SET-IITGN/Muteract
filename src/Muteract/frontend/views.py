import json
from pathlib import Path
import subprocess
from django.http import HttpRequest, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.shortcuts import render
from .metrics import calculate_corpus_bleu_score, calculate_rouge_l_score, get_shared_ngrams
from .llms import ChatGPT

BIN_DIR = Path(__file__).resolve().parent

ChatGPTClient = ChatGPT()

# Create your views here.
def index(request):
    return render(request, "frontend/index.html")

def mutate(request: HttpRequest):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    body = json.loads(request.body)
    prompt, options, seed = body['prompt'], body['options'], body['random_seed']
    mutation = getMutation(prompt, options, seed)
    return HttpResponse(
        json.dumps({
            "mutatedPrompt": mutation
            }
        ),
        content_type="application/json"
    )

def compare(request: HttpRequest):
    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])
    body = json.loads(request.body)
    print("Compare: " + str(body))
    history, metrics = body['history'], body['metrics']
    return HttpResponse(
        json.dumps({
            "labels": list(range(1, len(history))),
            "datasets": [
            {'label': metric, 'data': getMetric(history, metric)}
            for metric in metrics
        ]}),
        content_type="application/json"
    )

def sendToLLM(request: HttpRequest):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    body = json.loads(request.body)
    if body['api'] != 'chat-gpt':
        return HttpResponseBadRequest("Only OpenAI API is supported currently.")
    response = callLLM(body)
    return HttpResponse(
        json.dumps({
            'modelResponse': response
        }),
        content_type="application/json"
    )

def listLLMs(request: HttpRequest):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])
    return HttpResponse(
        json.dumps(ChatGPTClient.get_models()),
        content_type="application/json"
    )

def callLLM(request):
    return ChatGPTClient.get_response(prompt=request['prompt'], model=request['model'], generation_config=request['config'])

def getMetric(history, metric='crystal-bleu'):
    if len(history) == 0:
        return {}
    base = history[0]['response']
    mutations = history[1:]
    response = []
    for mutation in mutations:
        if metric != "rouge-l":
            t1, t2, sn = get_shared_ngrams(base, mutation['response'])
            response.append(calculateMetric(t1, t2, sn, metric))
        else:
            response.append(calculate_rouge_l_score(base, mutation['response']))
    return response

def calculateMetric(t1, t2, sn, metric):
    if metric == 'corpus-bleu':
        return calculate_corpus_bleu_score(t1, t2)
    else:
        return None

def getMutation(prompt, mutation_options=None, seed=None):
    if seed == None: seed = 0
    mutation_options = buildCmdOptions(options=mutation_options, seed=seed)
    print(mutation_options)
    mutation = subprocess.run(
        [str(BIN_DIR) + '/bin/radamsa'] + mutation_options,
        input=prompt, 
        capture_output=True, 
        text=True,
        encoding="latin-1"
    )
    if mutation.returncode == 0 and mutation.stdout is not None:
        return mutation.stdout.strip()
    else:
        print(f"Error generating mutation for prompt with option: {mutation_options}")
        print(mutation.returncode, mutation.stderr)
        return None

def buildCmdOptions(options, seed):
    option_list = []
    if options != None:
        option_list = ['-p', 'od', '-m', ','.join(options)]
    else:
        option_list = ['-p', 'nd']
    return option_list + ['-s', str(seed)]