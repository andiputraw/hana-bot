#!/bin/sh

docker run --net=host -it -e NGROK_AUTHTOKEN=$NGROK_AUTHTOKEN ngrok/ngrok:latest http 8000