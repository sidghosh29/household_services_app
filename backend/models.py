from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

from datetime import datetime

db = SQLAlchemy()

# Models: User, Role 
'''Authentication and authorization both have to be done in an app.
When we use Flask Security, we will need to create both a User model and a Role mode. 
For authorization, we need access control. For access control, we need to have 
different roles in your application'''

class User(db.Model, UserMixin):
    #STATUS_PENDING = 0
    #STATUS_ACTIVE = 1
    #STATUS_BLOCKED = 2

    id = db.Column(db.Integer, primary_key=True)
    #Flask Security uses Email to authenticate a user. 
    email = db.Column(db.String(),unique=True, nullable=False)
    password = db.Column(db.String(), nullable=False)
    fs_uniquifier = db.Column(db.String(),unique=True, nullable=False)
    active = db.Column(db.Integer, default=0, nullable=False)

    roles = db.relationship('Role', secondary='user_role', backref='users')

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    description = db.Column(db.String(), unique=True, nullable=False)

class UserRole(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class ServiceProfessional(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)
    pincode = db.Column(db.String(6), nullable=False)

    description = db.Column(db.String, nullable=True)
    experience = db.Column(db.Integer, nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.now, nullable=False)
    service_type_id = db.Column(db.Integer, db.ForeignKey('service_type.id'), nullable=False)
    file_path = db.Column(db.String, nullable=True) 

    user = db.relationship('User', backref=db.backref('professional_profile', uselist=False,cascade="all,delete")) # uselist = False specifies that the rel is one to one
    service_type = db.relationship('ServiceType', backref='professional')

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)
    pincode = db.Column(db.String(6), nullable=False)

    user = db.relationship('User', backref=db.backref('customer_profile', uselist=False,cascade="all,delete"))
    

class ServiceType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    type_image = db.Column(db.String)
    services = db.relationship('Service', backref='service_type', lazy=True)
    


class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_type_id = db.Column(db.Integer, db.ForeignKey('service_type.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.Integer, nullable=True)  # Time required for the service in minutes


class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('service_professional.id'), nullable=True)
    date_of_request = db.Column(db.DateTime, default=datetime.now, nullable=False)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    service_status = db.Column(db.String, default='requested', nullable=False)  # "requested", "accepted", "completed", "closed"
    remarks = db.Column(db.String, nullable=True)
    rating = db.Column(db.Integer, nullable=True)

    service = db.relationship('Service', backref='service_requests')
    customer = db.relationship('Customer', backref='service_requests')
    professional = db.relationship('ServiceProfessional', backref='service_requests')



    