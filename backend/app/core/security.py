import jwt
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.models.enums import RoleEnum

security_bearer = HTTPBearer()

def create_access_token(data: dict) -> str:
    """
    Creates a JWT access token with expiration.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_bearer),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Validates the JWT token and retrieves the current user from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("id")
        if user_id is None:
            raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception

    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    return user

async def require_farmer(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency to restrict endpoint to Farmers only.
    """
    if current_user.role != RoleEnum.farmer:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized. Must be a farmer.")
    return current_user

async def require_owner(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency to restrict endpoint to Storage Owners only.
    """
    if current_user.role != RoleEnum.owner:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized. Must be an owner.")
    return current_user
