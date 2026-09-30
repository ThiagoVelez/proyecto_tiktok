"""
================================================================================
PROYECTO SOFÍA - BACKEND TIKTOK-LIKE API GATEWAY & MICROSERVICES ORCHESTRATOR
================================================================================
Arquitectura: Modular, SOLID y orientada a microservicios distribuidos.
Incluye motor de reglas de negocio en `reglas/` para control parental y seguridad
de contenido para proteger a toda la audiencia.
================================================================================
"""

import os
from pathlib import Path
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.core.config import settings
from backend.core.exceptions import SofiaBaseException, ParentalRestrictionException, ContentSafetyException
from backend.core.response import ApiResponse

# Importación de Routers de cada Microservicio Desacoplado
from backend.microservices.auth_service import auth_router
from backend.microservices.user_service import user_router
from backend.microservices.video_service import video_router
from backend.microservices.interaction_service import interaction_router
from backend.microservices.moderation_service import moderation_router
from backend.microservices.notification_service import notification_router
from backend.microservices.search_service import search_router
from backend.microservices.story_service import story_router

# Inicialización de la aplicación FastAPI
app = FastAPI(
    title="Proyecto Sofía API - Plataforma de Videos Cortos (TikTok)",
    description=(
        "Backend modular y distribuido en microservicios. Cuenta con motor de reglas "
        "de negocio en tiempo real para Control Parental, Protección de Audiencia infantil/adolescente, "
        "y moderación de contenidos."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Garantizar directorios de almacenamiento local para videos, miniaturas, historias y avatares
os.makedirs(os.path.join(settings.UPLOAD_DIR, "videos"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "thumbnails"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "stories"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "avatars"), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


# ==============================================================================
# MANEJADORES DE EXCEPCIONES GLOBALES
# ==============================================================================

@app.exception_handler(ParentalRestrictionException)
async def parental_restriction_handler(request: Request, exc: ParentalRestrictionException):
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content=ApiResponse.error_response(
            message=exc.detail,
            error={"type": "PARENTAL_CONTROL_RESTRICTION", "code": exc.error_code}
        ).model_dump()
    )


@app.exception_handler(ContentSafetyException)
async def content_safety_handler(request: Request, exc: ContentSafetyException):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ApiResponse.error_response(
            message=exc.detail,
            error={"type": "CONTENT_SAFETY_VIOLATION", "violations": exc.violations}
        ).model_dump()
    )


# ==============================================================================
# REGISTRO DE MICROSERVICIOS (API GATEWAY / ROUTING)
# ==============================================================================

API_V1_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_V1_PREFIX)
app.include_router(user_router, prefix=API_V1_PREFIX)
app.include_router(video_router, prefix=API_V1_PREFIX)
app.include_router(story_router, prefix=API_V1_PREFIX)
app.include_router(interaction_router, prefix=API_V1_PREFIX)
app.include_router(moderation_router, prefix=API_V1_PREFIX)
app.include_router(notification_router, prefix=API_V1_PREFIX)
app.include_router(search_router, prefix=API_V1_PREFIX)



# ==============================================================================
# ENDPOINTS DE SALUD Y RAÍZ
# ==============================================================================

@app.get("/", tags=["Sistema"])
def root_info():
    """Información general de la arquitectura y servicios en ejecución."""
    return ApiResponse.success_response(
        data={
            "platform": "Proyecto Sofía",
            "architecture": "Modular Microservices (SOLID)",
            "rules_engine": "backend/reglas (Active)",
            "docs": "/docs",
            "version": "1.0.0"
        },
        message="Backend de Proyecto Sofía operando con éxito."
    )


@app.get("/health", tags=["Sistema"])
def health_check():
    """Endpoint de monitoreo de disponibilidad y salud del Gateway."""
    return ApiResponse.success_response(
        data={"status": "healthy", "service": "api-gateway"},
        message="Todos los microservicios operativos."
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
