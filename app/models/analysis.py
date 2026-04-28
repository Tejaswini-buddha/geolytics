from sqlalchemy import Column, Integer, String
from app.database import Base

class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True)
    keyword = Column(String)
    project_id = Column(Integer)

    geo_score = Column(Integer)
    aeo_score = Column(Integer)
    visibility = Column(String)