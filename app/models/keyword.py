from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String)
    project_id = Column(Integer, ForeignKey("projects.id"))