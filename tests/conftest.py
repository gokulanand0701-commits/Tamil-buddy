import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Ensure all models are imported so Base.metadata knows about them
import app.models  # noqa: F401
from app.core.database import Base, get_db
from app.main import app
from app.models.user import User
from app.core.security import get_password_hash, create_access_token
from app.seed import seed_database

# Use in-memory SQLite with StaticPool so all threads/sessions share the same DB
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    seed_database(session)
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_child_user(db_session):
    user = User(
        name="Anbu",
        email="anbu@example.com",
        password_hash=get_password_hash("password123"),
        role="child",
        age=8,
        level=1,
        xp=0,
        streak_current=1,
        streak_best=1,
        streak_freezes_left=1
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_child_token(test_child_user):
    return create_access_token(test_child_user.id)


@pytest.fixture(scope="function")
def test_parent_user(db_session):
    user = User(
        name="Kavitha",
        email="kavitha@example.com",
        password_hash=get_password_hash("parent123"),
        role="parent",
        age=36,
        parent_pin="1234"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_parent_token(test_parent_user):
    return create_access_token(test_parent_user.id)
