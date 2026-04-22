from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Funko Hunter Store API"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"

    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "funko_hunter_store"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_EMAIL: str = ""
    SMTP_PASSWORD: str = ""
    ADMIN_EMAIL: str = ""

    JWT_SECRET_KEY: str = "daf328e800e9ecdecbc628a2223b3cdcb082e07224dd8e08da52dfbf1efe5817"
    JWT_ALGORITHM: str = "HS256"

    ASSISTANT_API_KEY: str = "a9f3kL92mxPqz1YxFHSMD967-ASSISTANT-KEY"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )


settings = Settings()