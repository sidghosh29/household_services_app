from flask_restful import Api, Resource, fields, marshal_with, marshal
from flask_security import auth_required, current_user, roles_required
from flask import request, jsonify, current_app as app
from backend.models import Service, Customer, User, ServiceProfessional, ServiceType, ServiceRequest, db
import logging
from datetime import datetime

cache = app.cache

api = Api(prefix='/api')

service_type_fields = {
    'id':fields.Integer,
    'name': fields.String,
    'type_image':fields.String,
}

service_fields = {
    'id': fields.Integer,
    'service_type_id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'price': fields.Float,
    'time_required': fields.Integer,  # Time required for the service in minutes
    'service_type': fields.Nested(service_type_fields)
}

user_fields = {
    'id':fields.Integer,
    'email': fields.String,
    'active': fields.Integer
}

# Define customer fields, including user details
customer_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'name': fields.String,
    'address': fields.String,
    'phone': fields.String,
    'pincode': fields.String,
    'user': fields.Nested(user_fields)  # Nested field for user details
}

# Define service professional fields, including user details
service_professional_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'name': fields.String,
    'address': fields.String,
    'phone': fields.String,
    'pincode': fields.String,
    'description': fields.String,
    'experience': fields.Integer,
    'date_created': fields.DateTime,
    'service_type_id': fields.Integer,
    'user': fields.Nested(user_fields)  # Nested field for user details
}

service_request_fields = {
    'id': fields.Integer,
    'service_id': fields.Integer,
    'customer_id': fields.Integer,
    'professional_id': fields.Integer,
    'date_of_request': fields.DateTime,
    'date_of_completion': fields.DateTime,
    'service_status': fields.String,
    'remarks': fields.String,
    'rating': fields.Integer,
    'service': fields.Nested({
        'id': fields.Integer,
        'name': fields.String,  # Assuming the `Service` model has a `name` attribute
        'service_type_id': fields.Integer
    }),
    
    'professional': fields.Nested({
        'id': fields.Integer,
        'name': fields.String,  # Assuming the `ServiceProfessional` model has a `name` attribute
    }),
    'customer': fields.Nested({
        'id': fields.Integer,
        'name': fields.String,  # Assuming the `Customer` model has a `name` attribute
    }),
}

class UserAPI(Resource):
    # Endpoint to approve a user
    @auth_required('token')
    @roles_required('admin')  # Only accessible to admins
    def post(self, user_id, action):
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        # Approve or block user based on action parameter
        if action == 'approve':
            user.active = 1  # Set active status to approved
            message = "User approved"
        elif action == 'block':
            user.active = 2  # Set active status to blocked
            message = "User blocked"
        else:
            return {"error": "Invalid action"}, 400

        db.session.commit()
        return {"message": message}, 200
    


class ServiceAPI(Resource):
    
    @marshal_with(service_fields)
    def get(self, service_id):
        cached_service = cache.get(f"{service_id}")
        if cached_service:
            print("returning cached service")
            return cached_service
        
        service = Service.query.get(service_id)
        if not service:
            return {"message": "Service not found"}, 404
        
        serialized_service = marshal(service, service_fields)
        cache.set(f"{service_id}", serialized_service, timeout=30)
        print("returning service from db")
        return service
    
    

    @auth_required('token')
    def delete(self, service_id):
        service = Service.query.get(service_id)
        if not service:
            return {"message": "Service not found"}, 404
        
        db.session.delete(service)
        db.session.commit()
        return {"message": "Service deleted successfully"}, 200


    @auth_required('token')
    def put(self, service_id):
        service = Service.query.get(service_id)
        if not service:
            return {"message": "Service not found"}, 404

        data = request.get_json()

        if 'name' in data:
            service.name = data['name']
        if 'description' in data:
            service.description = data['description']
        if 'price' in data:
            service.price = data['price']
        if 'time_required' in data:
            service.time_required = data['time_required']

        db.session.commit()

        return {"message": "Service updated successfully"}, 200



class ServiceListAPI(Resource):
    
    @cache.cached(timeout=10)
    @marshal_with(service_fields)
    def get(self):
        print("fetching from DB")
        services = Service.query.all()
        return services

    @auth_required('token')
    def post(self):
        data = request.get_json()
        type_id = data.get('service_type_id')
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        time_required = data.get('time_required')

        # Validate required fields
        if not name or not price:
            return {"message": "Name and price are required."}, 400

        # Create a new service
        service = Service(
            service_type_id = type_id,
            name=name,
            description=description,
            price=price,
            time_required=time_required
        )

        db.session.add(service)
        db.session.commit()

        return {"message": "Service created successfully"}, 201


class CustomerAPI(Resource):
    @marshal_with(customer_fields)
    def get(self, customer_id=None):
        """
        Retrieve a specific customer by ID or all customers.
        """
        if customer_id:
            customer = Customer.query.get(customer_id)
            if not customer:
                return {"message": "Customer not found"}, 404
            return customer
        else:
            user_id = request.args.get('user_id', type=int)
            if user_id:
                customer = Customer.query.filter_by(user_id=user_id).first()
                if not customer:
                    return {"message": "Customer not found with the given user_id"}, 404
                return customer
            customers = Customer.query.all()
            return customers
        
    @auth_required('token')
    def delete(self, customer_id):
        customer = Customer.query.get(customer_id)
        user = User.query.get(customer.user_id)
        print("User Found:",user)
        if not user:
            return {"message": "User not found"}, 404
        
        db.session.delete(user)
        db.session.commit()
        return {"message": "Customer deleted successfully"}, 200


class ServiceProfessionalAPI(Resource):
    @marshal_with(service_professional_fields)
    def get(self, professional_id=None):
        """
        Retrieve a specific service professional by ID or all professionals.
        """
        if professional_id:
            professional = ServiceProfessional.query.get(professional_id)
            if not professional:
                return {"message": "Service Professional not found"}, 404
            return professional
        else:

            user_id = request.args.get('user_id', type=int)
            if user_id:
                professional = ServiceProfessional.query.filter_by(user_id=user_id).first()
                if not professional:
                    return {"message": "Professional not found with the given user_id"}, 404
                return professional


            professionals = ServiceProfessional.query.all()
            return professionals
        
    @auth_required('token')
    def delete(self, professional_id):
        professional = ServiceProfessional.query.get(professional_id)
        user = User.query.get(professional.user_id)
        print("User Found:",user)
        if not user:
            return {"message": "User not found"}, 404
        
        db.session.delete(user)
        db.session.commit()
        return {"message": "Service Professional deleted successfully"}, 200
    





class ServiceTypeAPI(Resource):
    
    @marshal_with(service_type_fields)
    def get(self, id=None):
        if id:
            service_type = ServiceType.query.get(id)
            if not service_type:
                return {"message": "Service type not found"}, 404
            return service_type
        else:
            service_types = ServiceType.query.all()
            return service_types
        
        
    @auth_required('token')
    def post(self):
        data = request.get_json()
        name = data.get('name')
        

        # Validate required fields
        if not name:
            return {"message": "Name of Service Type is required."}, 400

        # Create a new service
        service_type = ServiceType(
            name=name,
        )

        db.session.add(service_type)
        db.session.commit()

        return {"message": "Service Type created successfully"}, 201

    @auth_required('token')
    def delete(self, id):
        service_type = ServiceType.query.get(id)
        if not service_type:
            return {"message": "Service Type not found"}, 404
        
        db.session.delete(service_type)
        db.session.commit()
        return {"message": "Service Type deleted successfully"}, 200


    @auth_required('token')
    def put(self, id):
        service_type = ServiceType.query.get(id)
        if not service_type:
            return {"message": "Service Type not found"}, 404

        data = request.get_json()

        if 'name' in data:
            service_type.name = data['name']
        

        db.session.commit()

        return {"message": "Service Type updated successfully"}, 200
        


class ServiceRequestAPI(Resource):
    @marshal_with(service_request_fields)
    def get(self, id=None):
        if id:
            service_request = ServiceRequest.query.get(id)
            if not service_request:
                return {"message": "Service Request not found"}, 404
            return service_request
        else:
            service_requests = ServiceRequest.query.all()
            return service_requests
        
    @auth_required('token')
    def post(self):
        data = request.get_json()
        service_id = data.get('service_id')
        user_id = data.get('user_id')

        customer_id = User.query.get(user_id).customer_profile.id
        # Validate required fields
        if not service_id or not customer_id:
            return {"message": "Service ID and Customer ID are required."}, 400

        # Create a new service request
        service_request = ServiceRequest(service_id = service_id, customer_id = customer_id)

        db.session.add(service_request)
        db.session.commit()

        return {"message": "Service Request created successfully"}, 201

    
    @auth_required('token')
    def put(self, id):
        data = request.get_json()
        service_request = ServiceRequest.query.get(id)
        if not service_request:
            return {"message": "Service Request not found"}, 404

        # Update fields based on the provided data
        if "service_status" in data:
            service_request.service_status = data["service_status"]
            if data["service_status"]=="completed" or data["service_status"]=="closed":
                service_request.date_of_completion = datetime.now()
                if "rating" in data:
                    service_request.rating = data["rating"]
                if "remarks" in data:
                    service_request.remarks = data["remarks"]
            elif data["service_status"]=="accepted":
                service_request.professional_id = data["professional_id"]
        
        if "remarks" in data:
            service_request.remarks = data["remarks"]

        db.session.commit()
        return {"message": "Service Request updated successfully", "service_request": marshal(service_request, service_request_fields)}, 200
    
    @auth_required('token')
    def delete(self, id):
        service_request = ServiceRequest.query.get(id)
        if not service_request:
            return {"message": "Service Request not found"}, 404
        
        db.session.delete(service_request)
        db.session.commit()
        return {"message": "Service Request deleted successfully"}, 200



# Add the API resource to the route
api.add_resource(UserAPI, '/users/<int:user_id>/<string:action>')
api.add_resource(ServiceAPI, '/services/<int:service_id>')
api.add_resource(ServiceListAPI, '/services')
api.add_resource(CustomerAPI, '/customers', '/customers/<int:customer_id>')
api.add_resource(ServiceProfessionalAPI, '/professionals', '/professionals/<int:professional_id>')
api.add_resource(ServiceTypeAPI, '/service-types/<id>', '/service-types')
api.add_resource(ServiceRequestAPI, '/service-requests/<id>', '/service-requests')

