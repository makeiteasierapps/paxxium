#!/bin/bash

# Define the source file
SOURCE_FILE="debate_service.py"

# Define the target directories
TARGET_DIRS=(
    "../functions/debate"
)

# Loop through each target directory and copy the source file to it
for DIR in "${TARGET_DIRS[@]}"; do
    cp "$SOURCE_FILE" "$DIR/"
done

echo "Copy operation completed."