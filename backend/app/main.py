from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, facilities, recommendations, bookings, payments, notifications, insights

app = FastAPI(
    title="Grain Guard API",
    description="Backend API for Grain Guard application",
    version="1.0.0"
)

# Set up CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(facilities.router)
app.include_router(recommendations.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(notifications.router)
app.include_router(insights.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Grain Guard API is running"}
