import os
import pathlib
import sys
import webbrowser
import argparse

def start():
    parser = argparse.ArgumentParser(description="Muteract")
    parser.add_argument('--silent', action='store_true', help='Run in silent mode (does not open a browser window)')
    args = parser.parse_args()
    if not os.environ.get('OPEN_AI_API_KEY', ""):
        raise Exception("API Key not configured!!\n\nSet the OPEN_AI_API_KEY environment variable to a valid API key to start the application!!!\nExiting...")
    if not os.environ.get('NLTK_DATA', ""):
        print("Path to NLTK Data not found!! Comparisons CANNOT be performed using the Comparison button!!", file=sys.stderr)
    os.system(f'python {pathlib.Path(__file__).parent.resolve()}/manage.py runserver localhost:8000 > muteract_runlog.log 2>&1 &')
    if not args.silent:
        webbrowser.open("localhost:8000")
    else:
        print("Starting in Silent mode...")

if __name__ == "__main__":
    start()