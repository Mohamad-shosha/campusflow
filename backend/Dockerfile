# ==============================================================================
# Stage 1: Build the Spring Boot application using Maven
# ==============================================================================
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

COPY pom.xml ./
RUN mvn dependency:go-offline -B -Dhttp.keepAlive=false -Dmaven.wagon.http.retryHandler.count=3 || true

COPY src/ ./src/
RUN mvn package -DskipTests -B -Dhttp.keepAlive=false -Dmaven.wagon.http.retryHandler.count=3

# ==============================================================================
# Stage 2: Minimal runtime image using Eclipse Temurin JRE
# ==============================================================================
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /build/target/fbsu-campus-backend-*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Duser.timezone=Asia/Riyadh", "-jar", "app.jar"]
