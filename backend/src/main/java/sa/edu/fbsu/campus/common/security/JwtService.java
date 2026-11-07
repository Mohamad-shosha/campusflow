package sa.edu.fbsu.campus.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.UserType;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private final SecretKey key;
    private final long accessTokenExpirationMinutes;
    private final long refreshTokenExpirationDays;

    public JwtService(
            @Value("${app.security.jwt.secret}") String secretHex,
            @Value("${app.security.jwt.access-token-expiration-minutes:15}") long accessTokenExpirationMinutes,
            @Value("${app.security.jwt.refresh-token-expiration-days:7}") long refreshTokenExpirationDays
    ) {
        byte[] keyBytes = Decoders.BASE64.decode(secretHex);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenExpirationMinutes = accessTokenExpirationMinutes;
        this.refreshTokenExpirationDays = refreshTokenExpirationDays;
    }

    public String generateAccessToken(
            UUID userId,
            UUID universityId,
            String universityNumber,
            Set<Role> roles,
            UserType userType,
            String locale
    ) {
        Instant now = Instant.now();
        Instant expiry = now.plus(accessTokenExpirationMinutes, ChronoUnit.MINUTES);

        List<String> roleAuthorities = roles.stream()
                .map(r -> "ROLE_" + r.name())
                .collect(Collectors.toList());

        return Jwts.builder()
                .subject(userId.toString())
                .claim("universityId", universityId.toString())
                .claim("universityNumber", universityNumber)
                .claim("roles", roleAuthorities)
                .claim("userType", userType.name())
                .claim("locale", locale != null ? locale : "ar")
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(extractAllClaims(token).getSubject());
    }

    public UUID extractUniversityId(String token) {
        String universityIdStr = extractAllClaims(token).get("universityId", String.class);
        return universityIdStr != null ? UUID.fromString(universityIdStr) : null;
    }

    public String extractUniversityNumber(String token) {
        return extractAllClaims(token).get("universityNumber", String.class);
    }

    public List<String> extractRoles(String token) {
        List<?> rawRoles = extractAllClaims(token).get("roles", List.class);
        if (rawRoles == null) return Collections.emptyList();
        return rawRoles.stream().map(Object::toString).collect(Collectors.toList());
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public long getAccessTokenExpirationSeconds() {
        return accessTokenExpirationMinutes * 60;
    }

    public long getRefreshTokenExpirationDays() {
        return refreshTokenExpirationDays;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
