from flask import current_app as app, request, jsonify, render_template, send_file
from flask_security import auth_required, verify_password, hash_password, SQLAlchemyUserDatastore, roles_required
from backend.models import db, Customer, ServiceProfessional, User
from werkzeug.utils import secure_filename
import os
from backend.celery.tasks import add, create_csv
from celery.result import AsyncResult

datastore: SQLAlchemyUserDatastore = app.security.datastore

@app.route('/', methods=["GET"])
def home():
    return render_template("index.html")

@app.get("/celery")
def celery():
    task = add.delay(10,20)
    return {'task_id': task.id}, 200

@app.get("/get-celery-data/<id>")
def get_celery_data(id):
    result = AsyncResult(id)

    if result.ready():
        return {'result': result.result}, 200
    else:
        return {'message': 'result not ready'}, 405
    
@app.get('/create-sr-csv')
def create_sr_csv():
    task = create_csv.delay()
    return {'task_id': task.id}, 200

@app.get('/get-sr-csv/<id>')
def get_sr_csv(id):

    result = AsyncResult(id)

    if result.ready():
        return send_file(f'./backend/celery/user_downloads/{result.result}'), 200
    else:
        return {'message': 'result not ready'}, 405



# d58f09c3-b41b-4f0b-8712-77467f14c1e9
@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method=="POST":
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
           
            return jsonify({"message": "Invalid Inputs" }), 404
        
        print("Email",email, password)
        
        user = datastore.find_user(email=email)
        
        if not user:
            return {"message": "Invalid Email" }, 401
        if verify_password(password, user.password):
            if user.active==2:
                return {"message": "You have been blocked. If this is a mistake, please contact the administrator." }, 401
            if user.active==0:
                return {"message": "Your registration is under review. Please wait for the verification result and try again later. Thank you." }, 403
            if user.roles[0].name=="customer":
                return {'token': user.get_auth_token(), 'email':user.email, 'role': user.roles[0].name, 'id':user.id, 'sp_id':"", 'customer_id':user.customer_profile.id}
            elif user.roles[0].name=="service_professional":
                return {'token': user.get_auth_token(), 'email':user.email, 'role': user.roles[0].name, 'id':user.id, 'sp_id':user.professional_profile.id, 'customer_id':""}, 201
            else:
               return {'token': user.get_auth_token(), 'email':user.email, 'role': user.roles[0].name, 'id':user.id, 'sp_id':"", 'customer_id':""}, 201 
        return {"message": "Invalid Password" }, 401
    

@app.route('/customer-register', methods=["GET", "POST"])
def customer_register():
    if request.method=="POST":
        data = request.get_json()
        print(type(data))
        email = data.get('email')
        password = data.get('password')
        role = "customer"
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        pincode = data.get('pincode')

        if not email or not password or not name or not address or not phone or not pincode:
            return jsonify({"message": "Invalid Inputs" }), 404
        
        user = datastore.find_user(email=email)
        if user:
            return jsonify({"message": "User Already Exists" }), 409
        
        try:
            user = datastore.create_user(email=email, password=hash_password(password), roles=[role])
            db.session.commit()
             # Create Customer profile and link to the user
            customer = Customer(
                user_id=user.id,
                name=name,
                address=address,
                phone=phone,
                pincode=pincode)
            
            db.session.add(customer)
            db.session.commit()
            return jsonify({"message": "Customer registered successfully"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error creating customer: {str(e)}"}), 500
        


@app.route('/service-professional-register', methods=["POST"])
def service_professional_register():
    if request.method == "POST":
        data = request.form
        file = request.files.get('file')

        email = data.get('email')
        password = data.get('password')
        role = "service_professional"
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        pincode = data.get('pincode')
        description = data.get('description')
        experience = data.get('experience')
        service_type_id = data.get('service_type_id')

        if not email or not password or not name or not address or not phone or not pincode or not service_type_id:
            return jsonify({"message": "Invalid Inputs"}), 400

        # Check if the user already exists
        user = datastore.find_user(email=email)
        if user:
            return jsonify({"message": "User Already Exists"}), 409

        try:
            file_path = None
            if file:
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                file.save(file_path)


            # Create the User
            user = datastore.create_user(email=email, password=hash_password(password), active=0, roles=[role])
            db.session.commit()  # Commit to get the user_id

            # Create the Service Professional profile and link it to the user
            service_professional = ServiceProfessional(
                user_id=user.id,
                name=name,
                address=address,
                phone=phone,
                pincode=pincode,
                description=description,
                experience=experience,
                service_type_id=service_type_id,
                file_path=file_path
            )
            
            db.session.add(service_professional)
            db.session.commit()

            return jsonify({"message": "Service professional registered successfully"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error creating service professional: {str(e)}"}), 500
        

