from sqlalchemy import Column,Integer,Float
from app.database import Base

class Prediction(Base):
    __tablename__="predictions"

    id=Column(Integer,primary_key=True)
    geo_score=Column(Float)
    aeo_score=Column(Float)