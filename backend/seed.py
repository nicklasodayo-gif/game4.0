"""Creates the default admin user defined in .env (ADMIN_EMAIL / ADMIN_PASSWORD).

Run with: `python seed.py` (from within the backend/ directory, with the
virtualenv active and dependencies installed).
"""
from app.core.config import get_settings
from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models import AdminUser


def main() -> None:
    settings = get_settings()
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter(AdminUser.email == settings.admin_email).first()
        if existing:
            print(f"Admin user '{settings.admin_email}' already exists — skipping.")
            return

        admin = AdminUser(
            email=settings.admin_email,
            full_name="Platform Admin",
            hashed_password=hash_password(settings.admin_password),
        )
        db.add(admin)
        db.commit()
        print(f"Created admin user: {settings.admin_email}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
