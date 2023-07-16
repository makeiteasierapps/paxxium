from myapp import create_app
import eventlet

app = create_app()

if __name__ == "__main__":
    eventlet.wsgi.server(eventlet.listen(("", 5000)), app)
