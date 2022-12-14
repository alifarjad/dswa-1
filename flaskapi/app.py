import random
import time
from flask import Flask, jsonify, request, redirect, render_template
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, String
from  sqlalchemy.sql.expression import func

#Docker
#sudo apt-get install build-dep python-psycopg2

baseurl = 'http://localhost:5001/'

###Initialize DB and ORM
engine = create_engine(
    "postgresql+psycopg2://flask:flask@postgresflask:5432/flask"
    , pool_size=50, max_overflow=0
)

Base = declarative_base()
class UrlMapping(Base):
     __tablename__ = "url_mappings"

     id = Column(String(10),  primary_key=True, index=True)
     url = Column(String, index=True)
    
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

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/url', methods=['POST'])
def shorten_url():
    url_to_shorten = request.json.get('url', None)
    if not url_to_shorten:
        return 'Bad request', 400
    if not (url_to_shorten[0:8]=='https://' or url_to_shorten[0:7]=='http://'):
        return 'Provide url starting with http or https://', 403
    session = Session()
    url_mapping = session.query(UrlMapping).filter_by(url=url_to_shorten).first()
    if not url_mapping:
        shortened = random_string_10()
        session.add(UrlMapping(id=shortened, url=url_to_shorten))
        session.commit()
        session.close()
        return jsonify({ 'url': url_to_shorten, 'shortened' :  baseurl+shortened}), 201
    else:
        shortened = url_mapping.id
        session.commit()
        session.close()
        return jsonify({ 'url': url_to_shorten, 'shortened' :  baseurl+shortened}), 200

@app.route('/random', methods=['GET'])
def random_url():
    session = Session()
    url_mapping = session.query(UrlMapping).order_by(func.random()).limit(1).first()
    if not url_mapping:
        session.commit()
        session.close()
        return 'Not found', 404
    else:
        url = url_mapping.url
        session.commit()
        session.close()
        return redirect(url, code=302)

@app.route('/<shortened_url>', methods=['GET'])
def redirect_url(shortened_url):
    session = Session()
    url_mapping = session.query(UrlMapping).filter(UrlMapping.id==str(shortened_url)).first()
    if not url_mapping:
        session.commit()
        session.close()
        return 'Not found', 404
    else:
        url = url_mapping.url
        session.commit()
        session.close()
        return redirect(url, code=302)

#Should give us 62^10 possible combinations
def random_string_10():
    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return ''.join(random.choice(chars) for i in range(10))
