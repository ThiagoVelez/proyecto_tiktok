# ==============================================================================
# PROYECTO SOFÍA - DOCKERFILE MULTI-STAGE DE PRODUCCIÓN (FASTAPI BACKEND)
# ==============================================================================

# Etapa 1: Builder
FROM python:3.12-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Etapa 2: Imagen Final Runtime
FROM python:3.12-slim AS runtime

WORKDIR /app

# Instalar FFmpeg para procesamiento de video y curl para healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar dependencias compiladas desde el builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Variables de entorno de ejecución Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Crear usuario sin privilegios para mitigar riesgos de seguridad
RUN useradd -m -u 1000 appuser && \
    mkdir -p /app/backend/uploads /app/uploads && \
    chown -R appuser:appuser /app

# Copiar código fuente
COPY --chown=appuser:appuser . /app

USER appuser

EXPOSE 8000

# Healthcheck de contenedor nativo
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
