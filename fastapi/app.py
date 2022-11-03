import random
import os
import time
from fastapi import FastAPI, status, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse, Response
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, String
from  sqlalchemy.sql.expression import func
from pydantic import BaseModel

import logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

#Docker
#sudo apt install uvicorn
#sudo apt-get install build-dep python-psycopg2

baseurl = 'http://localhost:5000/'

###Create model for input
class UrlMappingRequest(BaseModel):
    url: str


###Initialize DB and ORM
engine = create_engine(
    "postgresql+psycopg2://fastapi:fastapi@postgresfastapi:5432/fastapi",
)

Base = declarative_base()
class UrlMapping(Base):
     __tablename__ = "url_mappings"

     id = Column(String(10),  primary_key=True)
     url = Column(String)

     def __repr__(self):
         return "<UrlMapping(id='%s', url='%s')>" % (
             self.id,
             self.url
         )

while(True):
    try:
        time.sleep(1)
        Base.metadata.create_all(engine)
        break
    except(Exception):
        print("Connection to database failed. Retrying...")
Session = sessionmaker(bind=engine)
###

app = FastAPI()

@app.get('/')
async def index():
    with open(os.path.join('./index.html')) as fh:
        data = fh.read()
    return Response(content=data, media_type="text/html")

@app.post('/url')
async def shorten_url(item: UrlMappingRequest):
    url_to_shorten = item.url
    if not url_to_shorten or len(url_to_shorten)==0:
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f'Url not passed',
        )
    if not (url_to_shorten[0:8]=='https://' or url_to_shorten[0:7]=='http://'):
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f'Url must start with either http or https',
        )
    session = Session()
    url_mapping = session.query(UrlMapping).filter_by(url=url_to_shorten).first()
    print(url_mapping)
    if not url_mapping:
        shortened = random_string_10()
        session.add(UrlMapping(id=shortened, url=url_to_shorten))
        session.commit()
        return JSONResponse(content={ 'url': url_to_shorten, 'shortened' :  baseurl+shortened}, status_code=status.HTTP_201_CREATED)
    else:
        session.commit()
        return JSONResponse(content={ 'url': url_mapping.url, 'shortened' :  baseurl+url_mapping.id}, status_code=status.HTTP_200_OK)

@app.get('/random')
async def random_url():
    session = Session()
    url_mapping = session.query(UrlMapping).order_by(func.random()).limit(1).first()
    if not url_mapping:
        session.commit()
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Url not found',
        )
    else:
        session.commit()
        return RedirectResponse(url_mapping.url, status_code=status.HTTP_302_FOUND)

@app.get('/{shortened_url}')
async def redirect_url(shortened_url):
    session = Session()
    url_mapping = session.query(UrlMapping).filter(UrlMapping.id==str(shortened_url)).first()
    print(url_mapping)
    if not url_mapping:
        session.commit()
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Url not found',
        )
    else:
        session.commit()
        return RedirectResponse(url_mapping.url, status_code=status.HTTP_302_FOUND)

#Should give us 62^10 possible combinations
def random_string_10():
    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return ''.join(random.choice(chars) for i in range(10))