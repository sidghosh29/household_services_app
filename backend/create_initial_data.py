from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore


    userdatastore.find_or_create_role(name="admin", description="Super User role which requires no registration")
    userdatastore.find_or_create_role(name="service_professional", description="An individual that provides the service")
    userdatastore.find_or_create_role(name="customer", description="An individual who has to book a service request")



    if not userdatastore.find_user(email="admin@householdapp.com"):
        userdatastore.create_user(email="admin@householdapp.com", password=hash_password("adminpass"), roles=["admin"])

    '''if not userdatastore.find_user(email="servicepro@householdapp.com"):
        userdatastore.create_user(email="servicepro@householdapp.com", password=hash_password("servicepass"), roles=["service_professional"]) #for testing

    if not userdatastore.find_user(email="customer@householdapp.com"):
        userdatastore.create_user(email="customer@householdapp.com", password=hash_password("customerpass"), roles=["customer"]) #for testing'''


    db.session.commit()