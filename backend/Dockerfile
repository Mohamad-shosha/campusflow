# ==============================================================================
# Production runtime image using Eclipse Temurin JRE 21
# ==============================================================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy compiled executable fat JAR
COPY target/fbsu-campus-backend-*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Duser.timezone=Asia/Riyadh", "-jar", "app.jar"]
