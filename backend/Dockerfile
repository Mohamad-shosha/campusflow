# ==============================================================================
# Stage 1: Build the Spring Boot application using Maven Wrapper
# ==============================================================================
FROM amazoncorretto:21-alpine AS builder

WORKDIR /build

# Copy Maven wrapper and POM first for effective layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy application source code and compile
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests -B

# ==============================================================================
# Stage 2: Runtime image using minimal Alpine JRE
# ==============================================================================
FROM amazoncorretto:21-alpine-jre

# Security: Run as a non-privileged dedicated user
RUN addgroup -S fbsu && adduser -S fbsu -G fbsu

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /build/target/fbsu-campus-backend-*.jar app.jar

# Install curl for reliable health checks
RUN apk add --no-cache curl tzdata && \
    cp /usr/share/zoneinfo/Asia/Riyadh /etc/localtime && \
    echo "Asia/Riyadh" > /etc/timezone && \
    chown -R fbsu:fbsu /app

USER fbsu:fbsu

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Duser.timezone=Asia/Riyadh", "-jar", "app.jar"]
