from app import createApp, createSio

app = createApp()
sio = createSio(app)
if __name__ == "__main__":
    sio.run(app, debug = True)

