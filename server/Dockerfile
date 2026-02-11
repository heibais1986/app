# --- Build Stage ---
# Use an official Maven image to build the application.
# This image includes a full JDK and Maven.
FROM maven:3.8.5-openjdk-18 AS build

# Set the working directory inside the container
WORKDIR /workspace

# Copy the Maven project files and the local dependencies
COPY pom.xml .

# Copy the source code
COPY src ./src

# Build the application and create the JAR file.
# This command will also download all the required dependencies.
# We skip the tests to speed up the build process.
RUN mvn clean package -DskipTests

# --- Run Stage ---
# Use a lightweight JRE image for the final application image.
# This reduces the final image size significantly.
FROM eclipse-temurin:18-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the executable JAR file from the build stage
COPY --from=build /workspace/target/server.jar server.jar
COPY src/main/resources/application.properties application.properties

# Expose the port the application runs on
EXPOSE 8080

# Command to run the application. The database credentials will be passed as environment variables.
ENTRYPOINT ["java", "-jar", "/app/server.jar"]
