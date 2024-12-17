from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import email_reminder, send_pending_request_reminders, send_monthly_activity_reports
celery_app = app.extensions['celery']

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    #daily 10:30 PM reminder
    sender.add_periodic_task(crontab(hour=14, minute=11, day_of_month="25"),email_reminder.s("sidghosh8953@gmail.com", "test reminder to login", "<h1>Hey Buddy!</h1>"))
    sender.add_periodic_task(
            crontab(hour=21, minute="*"), 
            send_pending_request_reminders.s(),
        )
    sender.add_periodic_task(
    crontab(day_of_month=10, hour=21, minute="*"),
    send_monthly_activity_reports.s())
