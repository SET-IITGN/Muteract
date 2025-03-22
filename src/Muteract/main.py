import os
import webbrowser

def start():
    if not os.environ.get('OPEN_AI_API_KEY', ""):
        raise Exception("API Key not configured!!\n\nSet the OPEN_AI_API_KEY environment variable to a valid API key to start the application!!!\nExiting...")
    os.system(f'python manage.py runserver localhost:8000')
    webbrowser.open("localhost:8000")

if __name__ == "__main__":
    start()