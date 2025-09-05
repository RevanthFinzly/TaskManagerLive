# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /backend

# Copy everything into the container
COPY . .

# Build the app using Maven Wrapper
RUN ./mvnw clean package -DskipTests

# Expose port (Render will override with $PORT)
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "target/crud-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=prod"]
