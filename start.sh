#!/bin/bash

export GEMINI_API_KEY="Your API Key Here"
export OPEN_AI_API_KEY="Your API Key Here"
export GCP_REGION=""
export GCP_PROJECT=""

if [ -z $1 ]; 
then
    echo "Start Production"
elif [[ $1 == "-d" ]]
then
    echo "Start Dev"
fi
python manage.py runserver
