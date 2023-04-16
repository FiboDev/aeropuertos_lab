from application import create_app 

app = create_app()

from application.routes import *

if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run("0.0.0.0", port = 8000)