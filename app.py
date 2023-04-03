import logging
import webbrowser
from contextlib import redirect_stdout
from io import StringIO
from dotenv import load_dotenv
load_dotenv()

from server import server

logger = logging.getLogger(__name__)

if __name__ == '__main__':
    # open browser in a separate thread
    with redirect_stdout(StringIO()): 
        chrome_path = 'open -a /Applications/Google\ Chrome.app %s'           
        webbrowser.get(chrome_path).open("http://localhost:3721")
    # start server
    server.run("127.0.0.1", 3721, debug=True)
