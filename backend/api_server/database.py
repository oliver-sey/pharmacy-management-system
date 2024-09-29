from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define your database URL
SQLALCHEMY_DATABASE_URL = 'postgresql+asyncpg://davidlin:910212@localhost/SFWE403'

# Create an async engine
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Create a configured "Session" class
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Base class for your models
Base = declarative_base()

# Dependency to get the DB session
async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

