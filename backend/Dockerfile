# ==============================================================================
# Stage 1: build the executable JAR from source, so the image can never ship a
# stale jar left over in target/ (P8-01 finding).
# ==============================================================================
FROM eclipse-temurin:21-jdk AS build

WORKDIR /build

# Resolve dependencies first so they are cached between source-only changes
COPY mvnw pom.xml ./
COPY .mvn .mvn
# Strip Windows line endings from the wrapper script when built from a Windows checkout
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw -q -B dependency:go-offline

COPY src src
RUN ./mvnw -q -B package -DskipTests && cp target/fbsu-campus-backend-*.jar /build/app.jar

# ==============================================================================
# Stage 2: minimal runtime image running as an unprivileged user
# ==============================================================================
FROM eclipse-temurin:21-jre

WORKDIR /app

RUN groupadd --system app && useradd --system --gid app --no-create-home app

COPY --from=build --chown=app:app /build/app.jar app.jar

USER app

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Duser.timezone=Asia/Riyadh", "-jar", "app.jar"]
