from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.security import (
    hash_password,
    verify_password,
    hash_token,
    create_access_token,
    create_refresh_token,
)
from app.dependencies import get_db
from app.models.user import User
from app.models.token import RefreshToken
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    RevokeTokenRequest,
    MessageResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account"
)
async def register(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    # Check if email is already registered
    existing_user_query = select(User).where(User.email == data.email.lower().strip())
    existing_user = (await db.execute(existing_user_query)).scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists"
        )

    # Hash password with bcrypt
    hashed = hash_password(data.password)

    # Create user
    new_user = User(
        email=data.email.lower().strip(),
        password_hash=hashed,
        name=data.name.strip(),
        phone=data.phone.strip() if data.phone else None,
        role=data.role,
        is_active=True,
    )
    db.add(new_user)
    await db.flush() # Populate new_user.id

    # Generate tokens
    access_token = create_access_token(subject=str(new_user.id), role=new_user.role)
    raw_refresh_token, token_hash, expires_at = create_refresh_token(user_id=str(new_user.id))

    # Store refresh token hash
    refresh_record = RefreshToken(
        user_id=new_user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        revoked=False,
    )
    db.add(refresh_record)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=raw_refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate user and issue tokens"
)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(User).where(User.email == data.email.lower().strip())
    user = (await db.execute(stmt)).scalar_one_or_none()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )

    # Generate tokens
    access_token = create_access_token(subject=str(user.id), role=user.role)
    raw_refresh_token, token_hash, expires_at = create_refresh_token(user_id=str(user.id))

    # Store refresh token hash
    refresh_record = RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        revoked=False,
    )
    db.add(refresh_record)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=raw_refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Rotate refresh token and issue new access token"
)
async def refresh_tokens(
    data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    provided_hash = hash_token(data.refresh_token)

    stmt = select(RefreshToken).where(RefreshToken.token_hash == provided_hash)
    token_record = (await db.execute(stmt)).scalar_one_or_none()

    if not token_record or not token_record.is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired, or revoked refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Invalidate the used refresh token (token rotation)
    token_record.revoked = True

    # Retrieve associated user
    user_stmt = select(User).where(User.id == token_record.user_id)
    user = (await db.execute(user_stmt)).scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Associated user is invalid or deactivated",
        )

    # Issue new access token and new rotated refresh token
    access_token = create_access_token(subject=str(user.id), role=user.role)
    new_raw_refresh, new_token_hash, new_expires_at = create_refresh_token(user_id=str(user.id))

    new_token_record = RefreshToken(
        user_id=user.id,
        token_hash=new_token_hash,
        expires_at=new_expires_at,
        revoked=False,
    )
    db.add(new_token_record)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_raw_refresh,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

@router.post(
    "/revoke",
    response_model=MessageResponse,
    summary="Revoke a refresh token (Sign Out)"
)
async def revoke_token(
    data: RevokeTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    provided_hash = hash_token(data.refresh_token)

    stmt = select(RefreshToken).where(RefreshToken.token_hash == provided_hash)
    token_record = (await db.execute(stmt)).scalar_one_or_none()

    if token_record and not token_record.revoked:
        token_record.revoked = True
        await db.commit()

    return MessageResponse(message="Token successfully revoked")
