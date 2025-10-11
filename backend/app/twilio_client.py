# Twilio client placeholder
from app import config
from twilio.rest import Client

def make_call():
    client = Client(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)

    call = client.calls.create(
        twiml='<Response><Say>🚨 Crypto Alarm Alert! Your price target has been reached.</Say></Response>',
        to=config.USER_PHONE_NUMBER,
        from_=config.TWILIO_PHONE_NUMBER
    )
    return call.sid
