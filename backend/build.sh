#!/usr/bin/env bash
# exit on error
set -o errexit

# Build the project
./mvnw clean package -DskipTests