import asyncio
from sqlalchemy.future import select
from app.core.database import AsyncSessionLocal
from app.models.user import User

async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        print(f"Total Users: {len(users)}")
        print("-" * 50)
        for u in users:
            print(f"ID: {u.id} | Name: {u.name} | Phone: {u.phone} | Role: {u.role.value} | Membership: {u.membership_plan.value} | Unique ID: {u.unique_id}")

if __name__ == "__main__":
    asyncio.run(main())
