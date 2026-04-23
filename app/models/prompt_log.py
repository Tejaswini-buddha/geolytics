from sqlalchemy import Column,Integer,String
from app.database import Base


class PromptLog(Base):
    __tablename__="prompt_logs"

    id=Column(Integer,primary_key=True,index=True)

    keyword=Column(String)

    prompt_text=Column(String)

    success_score=Column(Integer)