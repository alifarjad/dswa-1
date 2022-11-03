FROM python:3.10.6
WORKDIR /usr/app
COPY ./app.py ./requirements.txt ./index.html ./
RUN python3 -m pip install -r requirements.txt
ENTRYPOINT [ "python3", "-m", "uvicorn", "app:app", "--host=0.0.0.0", "--port", "5000"  ]