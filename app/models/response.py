from sqlalchemy import Column, Integer, Text, ForeignKey
from app.database import Base

class AIResponse(Base):
    __tablename__ = "ai_responses"

    id = Column(Integer, primary_key=True)
    content = Column(Text)
    prompt_id = Column(Integer, ForeignKey("prompts.id"))