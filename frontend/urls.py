from django.urls import path
from . import views

urlpatterns = [
  path("", views.index),
  path("api/mutate/", views.mutate),
  path("api/compare/", views.compare),
  path("api/llm/", views.sendToLLM),
  path("api/list/", views.listLLMs)
]