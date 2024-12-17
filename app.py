from flask import Flask
from flask_cors import CORS
from backend.config import LocalDevelopmentConfig
from backend.models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore
from flask_caching import Cache
from backend.celery.celery_factory import celery_init_app
import flask_excel as excel

def create_app():
    app = Flask(__name__, template_folder='frontend', static_folder="frontend", static_url_path="/static")

    app.config.from_object(LocalDevelopmentConfig)
    app.config['UPLOAD_FOLDER'] = 'uploads'

    # model init
    db.init_app(app)

    # cache init
    cache = Cache(app)


    # flask security
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore=datastore, register_blueprint=False) 
    '''When register_blueprint=False: The blueprint is not registered automatically. T
    This allows you to manually register it, modify its routes, or completely avoid using the default routes.'''

    app.cache = cache


    app.app_context().push()

    from backend.resources import api
    # api init
    api.init_app(app)
    CORS(app)
    return app

app = create_app()

celery_app = celery_init_app(app)
import backend.celery.celery_schedule

import backend.create_initial_data
import backend.routes

# Flask Excel
excel.init_excel(app)

if __name__=="__main__":
    app.run()