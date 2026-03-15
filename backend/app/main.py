from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, admin, product, cart
from app.database import Base, engine

app = FastAPI()

# ✅ CORS FIX (THIS IS THE IMPORTANT PART)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth.router)
app.include_router(product.router)
app.include_router(admin.router)
app.include_router(cart.router)


@app.get("/")
def root():
    return {"message": "Backend Running"}