#!/bin/bash

# Create .env if missing
if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env created. Please open .env and provide real values before starting the app!"
  exit 1
fi

# Check if JWT_SECRET has been changed from placeholder
if grep -q "JWT_SECRET=change-me-MySuperLongSecretKeyThatIsAtLeast32Chars" .env; then
  echo "Please set a real JWT_SECRET in your .env file before continuing."
  exit 1
fi

# Export all non-comment variables from .env
export $(grep -v '^#' .env | xargs)
echo "Environment variables loaded from .env"