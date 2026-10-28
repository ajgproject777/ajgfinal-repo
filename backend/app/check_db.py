import asyncio
import sys
from app.core.config import settings
from app.core.database import check_database_connection, get_masked_db_url

async def main() -> int:
    print("=" * 60)
    print("DineGo Database Connectivity Diagnostic")
    print("=" * 60)
    print(f"Target Database:  {get_masked_db_url()}")
    print(f"Environment:      {settings.ENVIRONMENT}")
    print("Testing connection (timeout: 3.0s)...")
    
    result = await check_database_connection(timeout_seconds=3.0)
    print("-" * 60)
    print(f"Connection Status: {result['status'].upper()}")
    print(f"Message:           {result['message']}")
    
    if result["status"] == "connected":
        print("\nSUCCESS: PostgreSQL is running and accepting async connections.")
        print("=" * 60)
        return 0
    else:
        print("\nACTION REQUIRED: PostgreSQL is currently unreachable.")
        print("To resolve this on macOS:")
        print("  Option A (Postgres.app):")
        print("    1. Download Postgres.app from https://postgresapp.com")
        print("    2. Open it and click 'Initialize'")
        print("    3. Run: createdb dinego")
        print("  Option B (Homebrew):")
        print("    1. brew install postgresql@16")
        print("    2. brew services start postgresql@16")
        print("    3. createdb dinego")
        print("=" * 60)
        return 1

if __name__ == "__main__":
    code = asyncio.run(main())
    sys.exit(code)
