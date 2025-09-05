FROM maven:3.8.5-openjdk:17 AS build

COPY ..
RUN mvn clean package -DskipTests

# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim
# Copy everything into the container
COPY --from=build /target/crud-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render will override with $PORT)
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
