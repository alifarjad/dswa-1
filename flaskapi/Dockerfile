FROM python:3.10.6
WORKDIR /usr/app
COPY ./app.py ./requirements.txt ./
COPY ./templates ./templates
RUN python3 -m pip install -r requirements.txt
ENTRYPOINT [ "flask", "run", "--host=0.0.0.0", "-p", "5001" ]