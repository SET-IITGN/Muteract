# import code_bert_score
import sys
import nltk
from collections import Counter
from nltk.util import ngrams
# from crystalbleu import corpus_bleu
import rouge.rouge_score as rouge_score

def get_shared_ngrams(contents1, contents2, max_ngram_len=13, most_common_ngrams=100):
    tokens1 = nltk.word_tokenize(contents1)
    tokens2 = nltk.word_tokenize(contents2)

    tokenized_corpus=tokens1+tokens2
    # <tokenized_corpus> is a list of strings

    # Extract all n-grams of length 1 to max_ngram_len
    all_ngrams = []
    for n in range(1, max_ngram_len+1):
        all_ngrams.extend(list(ngrams(tokenized_corpus, n)))

    #Calculate frequencies of all n-grams
    frequencies = Counter(all_ngrams)
    trivially_shared_ngrams = dict(frequencies.most_common(most_common_ngrams))
    return tokens1, tokens2, trivially_shared_ngrams

# def calculate_code_bert_similarity(base_code, mutated_code, language):
#     # print("CODE BERT")
#     reference_bert = [base_code]
#     hypothesis_bert = [mutated_code]
#     bert_score = code_bert_score.score(cands=hypothesis_bert, refs=reference_bert, lang=language)
#     f1 = bert_score[2].item()
#     return f1

def calculate_corpus_bleu_score(tokens1, tokens2):
    # print("CORPUS BLEU")
    reference=tokens1
    hypothesis=tokens2 #hypothesis is also called as candidate
    references=[reference]
    list_of_references=[references]
    list_of_hypotheses=[hypothesis]
    cbleu=nltk.translate.bleu_score.corpus_bleu(list_of_references, list_of_hypotheses)
    return cbleu

def calculate_sentence_bleu_score(tokens1, tokens2):
    # print("SENTENCE BLEU")
    references=tokens1
    hypothesis=tokens2 #hypothesis is also called as candidate
    sbleu=nltk.translate.bleu_score.sentence_bleu(references, hypothesis)
    return sbleu

def calculate_rouge_l_score(reference, hypothesis):
    return rouge_score.rouge_l_summary_level(reference_sentences=[reference], evaluated_sentences=[hypothesis])['f']

# def calculate_crystal_bleu_score(tokens1, tokens2, shared_ngrams):
#     # print("CRYSTAL BLEU")
#     reference=tokens1
#     hypothesis=tokens2 #hypothesis is also called as candidate
#     references=[reference]
#     list_of_references=[references]
#     list_of_hypotheses=[hypothesis]
#     crystalBLEU_score=corpus_bleu(list_of_references, list_of_hypotheses,ignoring=shared_ngrams) #crystalBLEU
#     return crystalBLEU_score

# def calculate_metrics(base_prompt_response, mutated_prompt_response):
#     language = "python"
#     tokens1, tokens2, shared_ngrams = get_shared_ngrams(base_prompt_response['response'], mutated_prompt_response['response'])
#     metrics = {
#         "code_bert_score": calculate_code_bert_similarity(
#             base_code=base_prompt_response['response'], 
#             mutated_code=mutated_prompt_response['response'], 
#             language=language
#         ),
#         "corpus_bleu_score": calculate_corpus_bleu_score(tokens1, tokens2),
#         "sentence_bleu_score": calculate_sentence_bleu_score(tokens1, tokens2),
#         "crystal_bleu_score": calculate_crystal_bleu_score(tokens1, tokens2, shared_ngrams)
#     }
#     return metrics