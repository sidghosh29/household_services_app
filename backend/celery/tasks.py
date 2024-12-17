from celery import shared_task
from flask import current_app as app, render_template
import time
from backend.models import ServiceRequest, ServiceProfessional, Service, Customer
import flask_excel
from backend.celery.mail_service import send_email
from datetime import datetime, timedelta
from sqlalchemy import or_

@shared_task(ignore_result = False)
def add(x,y):
    time.sleep(10)
    return x+y

@shared_task(bind = True, ignore_result=False)
def create_csv(self):
    resource = ServiceRequest.query.filter(
    or_(
        ServiceRequest.service_status == "closed",
        ServiceRequest.service_status == "completed"
    )).all()#ServiceRequest.query.all()


    task_id = self.request.id
    filename = f'service_requests_{task_id}.csv'
    column_names = [column.name for column in ServiceRequest.__table__.columns]
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names=column_names, file_type='csv')

    with open(f'./backend/celery/user_downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename

    '''When you use the @shared_task(bind=True) decorator, the function is essentially transformed into a method of a task instance 
    created by Celery internally. The self in this context refers to the task instance that Celery generates to manage the execution of this task.'''


@shared_task(ignore_result=True)
def email_reminder(to, subject, content):
    send_email(to, subject, content)



@shared_task(ignore_result=True)
def send_pending_request_reminders():
    """
    Task to send email reminders to professionals with pending service requests.
    """
    with app.app_context():
        # Query all service professionals
        professionals = ServiceProfessional.query.all()

        for professional in professionals:
            # Get the professional's service type ID
            service_type_id = professional.service_type_id

            # Find pending requests for this service type without an assigned professional
            pending_requests = ServiceRequest.query.filter(
            ServiceRequest.service_status == "requested",
            ServiceRequest.professional_id == None,
            ServiceRequest.service.has(Service.service_type_id == service_type_id)
        ).all()


            if pending_requests:
                # Prepare email content
                subject = "Reminder: Pending Service Requests"
                content = f"""
                <p>Dear {professional.name},</p>
                <p>You have pending service requests for your service type: {professional.service_type.name}.</p>
                <p>Please log in and accept the requests as soon as possible.</p>
                <p>Thank you!</p>
                """
                # Send the email
                try:
                    send_email(professional.user.email, subject, content)
                    print(f"Reminder sent to {professional.name} ({professional.user.email}).")
                except Exception as e:
                    print(f"Failed to send email to {professional.name}: {e}")




@shared_task(ignore_result=True)
def send_monthly_activity_reports():
    """
    Task to send a monthly activity report to all customers.
    """
    with app.app_context():
        # Determine the date range for the previous month using local time
        today = datetime.now()
        # First day of the current month
        first_day_of_current_month = today.replace(day=1) #today + timedelta(days=5)
        # Last day of the previous month
        last_day_of_last_month = first_day_of_current_month - timedelta(days=1)
        # First day of the previous month
        first_day_of_last_month = last_day_of_last_month.replace(day=1)

        # Query customers and generate reports
        customers = Customer.query.all()
        for customer in customers:
            # Get service requests for the customer in the last month
            service_requests = ServiceRequest.query.filter(
                ServiceRequest.customer_id == customer.id,
                ServiceRequest.date_of_request.between(first_day_of_last_month, last_day_of_last_month)
            ).all()

            # Generate the report
            requested_count = len(service_requests)
            print("Requested Count:", requested_count)
            closed_count = sum(1 for req in service_requests if req.service_status in ["completed", "closed"])
            print("Closed Count:", closed_count)

            service_details = [
                {
                    "id": req.id,
                    "service_name": req.service.name,
                    "status": req.service_status,
                    "requested_on": req.date_of_request.strftime("%Y-%m-%d"),
                    "completed_on": req.date_of_completion.strftime("%Y-%m-%d") if req.date_of_completion else "N/A"
                }
                for req in service_requests
            ]

            # Render email content using a Jinja2 template
            content = render_template(
                "monthly_report.html",
                customer_name=customer.name,
                requested_count=requested_count,
                closed_count=closed_count,
                service_details=service_details,
                month=first_day_of_last_month.strftime("%B %Y")
            )

            # Send the email
            subject = f"Monthly Activity Report - {first_day_of_last_month.strftime('%B %Y')}"
            try:
                send_email(customer.user.email, subject, content)
                print(f"Monthly report sent to {customer.name} ({customer.email}).")
            except Exception as e:
                print(f"Failed to send report to {customer.name}: {e}")