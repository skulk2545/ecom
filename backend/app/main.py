from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .routers import auth, products, orders, users, settings as settings_router, uploads
from .db.session import engine, Base
from .models import *  # ensure models are loaded

Base.metadata.create_all(bind=engine)

def create_app() -> FastAPI:
    app = FastAPI(
        title="Ecommerce API",
        version="1.0.0",
        description="Single-store e-commerce backend built with FastAPI",
    )

    # CORS configuration (adjust origins as needed for frontend)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).rstrip("/") for origin in settings.CORS_ALLOW_ORIGINS],
        allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):\d+$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(products.router, prefix="/api/products", tags=["products"])
    app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
    app.include_router(users.router, prefix="/api/users", tags=["users"])
    app.include_router(settings_router.router, prefix="/api/settings", tags=["settings"])
    app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])

    # Serve static files from the uploads directory
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

    return app


app = create_app()

