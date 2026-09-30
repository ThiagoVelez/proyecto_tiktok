from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.core.database import get_db, UserModel
from backend.core.security import get_current_user
from backend.core.response import ApiResponse
from .schemas import RegisterRequest, LoginRequest, AuthResponseData, UserSummary
from .service import AuthService

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/register", response_model=ApiResponse[AuthResponseData], status_code=status.HTTP_201_CREATED)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    """Registra una nueva cuenta de usuario con validación de edad y control parental."""
    service = AuthService(db)
    result = service.register(req)
    return ApiResponse.success_response(data=result, message="Usuario registrado exitosamente.")


@router.post("/login", response_model=ApiResponse[AuthResponseData])
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    """Inicia sesión y genera token JWT de acceso."""
    service = AuthService(db)
    result = service.login(req)
    return ApiResponse.success_response(data=result, message="Sesión iniciada con éxito.")


@router.get("/me", response_model=ApiResponse[UserSummary])
def get_current_profile(current_user: UserModel = Depends(get_current_user)):
    """Retorna los datos de la sesión del usuario actual autenticado."""
    from backend.reglas.parental_control import ParentalControlManager
    age = ParentalControlManager.calculate_user_age(current_user.birth_date)

    summary = UserSummary(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        birth_date=current_user.birth_date,
        role=current_user.role,
        account_type=current_user.account_type,
        is_minor=(age < 18),
        is_verified=current_user.is_verified,
        avatar_url=current_user.avatar_url,
        created_at=current_user.created_at
    )
    return ApiResponse.success_response(data=summary, message="Perfil obtenido.")
