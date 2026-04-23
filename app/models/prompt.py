from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True)
    text = Column(String)
    keyword_id = Column(Integer, ForeignKey("keywords.id"))