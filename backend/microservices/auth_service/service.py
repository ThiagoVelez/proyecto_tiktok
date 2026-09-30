from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.core.database import UserModel, ParentalControlModel
from backend.core.security import hash_password, verify_password, create_access_token
from backend.core.config import settings
from backend.reglas.parental_control import ParentalControlManager
from .schemas import RegisterRequest, LoginRequest, AuthResponseData, UserSummary, TokenData


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, req: RegisterRequest) -> AuthResponseData:
        # 1. Validar edad mínima (13 años según política de audiencia)
        user_age = ParentalControlManager.calculate_user_age(req.birth_date)
        if user_age < 13:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Debes tener al menos 13 años para registrarte en la plataforma."
            )

        # 2. Verificar existencia de usuario o email
        if self.db.query(UserModel).filter(UserModel.username == req.username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El nombre de usuario '@{req.username}' ya se encuentra registrado."
            )

        if self.db.query(UserModel).filter(UserModel.email == req.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El correo electrónico '{req.email}' ya está asociado a otra cuenta."
            )

        # 3. Determinar tipo de cuenta según la edad
        is_minor = user_age < 18
        account_type = "minor" if is_minor else (req.account_type if req.account_type in ("standard", "parent") else "standard")

        # 4. Crear usuario
        hashed_pwd = hash_password(req.password)
        new_user = UserModel(
            username=req.username,
            email=req.email,
            password_hash=hashed_pwd,
            full_name=req.full_name,
            birth_date=req.birth_date,
            role="user",
            account_type=account_type,
            is_verified=False,
            is_active=True
        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)

        # 5. Si es menor de edad, configurar automáticamente Control Parental de fábrica
        if is_minor:
            parental_config = ParentalControlModel(
                user_id=new_user.id,
                is_enabled=True,
                restricted_mode=True,
                daily_screen_time_limit_minutes=120,
                block_direct_messages=True,
                filter_mature_comments=True
            )
            self.db.add(parental_config)
            self.db.commit()

        # 6. Generar JWT
        token = create_access_token(
            data={"sub": str(new_user.id), "username": new_user.username, "role": new_user.role}
        )

        user_summary = UserSummary(
            id=new_user.id,
            username=new_user.username,
            email=new_user.email,
            full_name=new_user.full_name,
            birth_date=new_user.birth_date,
            role=new_user.role,
            account_type=new_user.account_type,
            is_minor=is_minor,
            is_verified=new_user.is_verified,
            avatar_url=new_user.avatar_url,
            created_at=new_user.created_at
        )

        return AuthResponseData(
            user=user_summary,
            token=TokenData(
                access_token=token,
                token_type="bearer",
                expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )

    def login(self, req: LoginRequest) -> AuthResponseData:
        user = self.db.query(UserModel).filter(
            (UserModel.username == req.username_or_email) | (UserModel.email == req.username_or_email)
        ).first()

        if not user or not verify_password(req.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas. Verifica tu usuario y contraseña."
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta cuenta ha sido suspendida por incumplimiento de las reglas."
            )

        user_age = ParentalControlManager.calculate_user_age(user.birth_date)
        token = create_access_token(
            data={"sub": str(user.id), "username": user.username, "role": user.role}
        )

        user_summary = UserSummary(
            id=user.id,
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            birth_date=user.birth_date,
            role=user.role,
            account_type=user.account_type,
            is_minor=(user_age < 18),
            is_verified=user.is_verified,
            avatar_url=user.avatar_url,
            created_at=user.created_at
        )

        return AuthResponseData(
            user=user_summary,
            token=TokenData(
                access_token=token,
                token_type="bearer",
                expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )
