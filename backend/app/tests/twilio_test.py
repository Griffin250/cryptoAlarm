import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")
my_phone = os.getenv("MY_PHONE_NUMBER")

client = Client(account_sid, auth_token)

def send_voice_alert(message: str):
    call = client.calls.create(
        to=my_phone,
        from_=twilio_number,
        twiml=f"<Response><Say>{message}</Say></Response>"
    )
    print(f"📞 Call triggered, SID: {call.sid}")
