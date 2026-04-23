from sqlalchemy import Column,Integer,String
from app.database import Base

class Citation(Base):
    __tablename__="citations"

    id=Column(Integer,primary_key=True)
    brand=Column(String)
    source_url=Column(String)
    rank_position=Column(Integer)