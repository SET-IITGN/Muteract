import os
import pathlib
import sys
import webbrowser

def start():
    if not os.environ.get('OPEN_AI_API_KEY', ""):
        raise Exception("API Key not configured!!\n\nSet the OPEN_AI_API_KEY environment variable to a valid API key to start the application!!!\nExiting...")
    if not os.environ('NLTK_DATA', ""):
        print("Path to NLTK Data not found!! Comparisons CANNOT be performed using the Comparison button!!", file=sys.stderr)
    os.system(f'python {pathlib.Path(__file__).parent.resolve()}/manage.py runserver localhost:8000 > muteract_runlog.log 2>&1 &')
    webbrowser.open("localhost:8000")

if __name__ == "__main__":
    start()