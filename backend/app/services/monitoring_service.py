import uuid
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import async_session_maker
from app.models.facility import Facility
from app.models.telemetry import FacilityTelemetry
from app.models.booking import Booking
from app.models.enums import NotificationTypeEnum, BookingStatusEnum
from app.services.notification_service import create_notification
from app.services.ai_service import get_agent

import json

async def check_facility_spoilage_risk(facility_id: uuid.UUID):
    """
    Background task to evaluate if the latest telemetry indicates a spoilage risk.
    """
    # Create a new session for the background task
    async with async_session_maker() as db:
        # 1. Get facility
        stmt_fac = select(Facility).where(Facility.id == facility_id)
        fac_res = await db.execute(stmt_fac)
        facility = fac_res.scalar_one_or_none()
        
        if not facility:
            return

        # 2. Get latest telemetry
        stmt_tel = (
            select(FacilityTelemetry)
            .where(FacilityTelemetry.facility_id == facility_id)
            .order_by(FacilityTelemetry.timestamp.desc())
            .limit(1)
        )
        tel_res = await db.execute(stmt_tel)
        telemetry = tel_res.scalar_one_or_none()

        if not telemetry:
            return

        # 3. Evaluate risk using AI or heuristics
        agent = get_agent()
        risk_detected = False
        reason = ""

        if agent:
            # We use Gemini to evaluate
            prompt = f"""
            You are an agricultural spoilage expert.
            A facility storing these grains: {facility.accepted_grains}
            Just reported these conditions: Temperature {telemetry.temperature_celsius}°C, Humidity {telemetry.humidity_percent}%.
            
            Determine if there is a HIGH risk of fungal growth or pest infestation.
            Respond strictly in JSON format: {{"risk_detected": true/false, "reason": "brief explanation"}}
            """
            try:
                # Need to run sync pydantic-ai call in executor if we didn't use async agent
                # Since we didn't setup async run in ai_service for raw text, we will do a basic heuristic fallback here
                pass 
            except Exception:
                pass
                
        # Since pydantic-ai agent from ai_service is typed for recommendations, 
        # let's use a deterministic heuristic fallback for reliability in this task.
        if telemetry.temperature_celsius > 30.0 or telemetry.humidity_percent > 70.0:
            risk_detected = True
            reason = f"High risk detected: Temperature is {telemetry.temperature_celsius}°C, Humidity is {telemetry.humidity_percent}%."
        
        if not risk_detected:
            return
            
        # 4. If risk detected, alert the owner
        await create_notification(
            db=db,
            user_id=facility.owner_id,
            title="⚠️ Spoilage Risk Alert",
            message=f"Facility {facility.name}: {reason}",
            type=NotificationTypeEnum.alert
        )

        # 5. Alert farmers with checked_in bookings
        stmt_bookings = select(Booking).where(
            Booking.facility_id == facility_id,
            Booking.status == BookingStatusEnum.checked_in
        )
        book_res = await db.execute(stmt_bookings)
        bookings = book_res.scalars().all()

        notified_farmers = set()
        for b in bookings:
            if b.farmer_id not in notified_farmers:
                await create_notification(
                    db=db,
                    user_id=b.farmer_id,
                    title="⚠️ Storage Condition Alert",
                    message=f"Your stored grain at {facility.name} may be at risk: {reason}",
                    type=NotificationTypeEnum.alert
                )
                notified_farmers.add(b.farmer_id)
