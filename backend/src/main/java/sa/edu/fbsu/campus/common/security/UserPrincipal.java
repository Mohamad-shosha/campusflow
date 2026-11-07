package sa.edu.fbsu.campus.common.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import sa.edu.fbsu.campus.identity.domain.User;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {

    private static final long serialVersionUID = 1L;

    private final UUID userId;
    private final UUID universityId;
    private final String universityNumber;
    private final String password;
    private final boolean enabled;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(
            UUID userId,
            UUID universityId,
            String universityNumber,
            String password,
            boolean enabled,
            Collection<? extends GrantedAuthority> authorities
    ) {
        this.userId = userId;
        this.universityId = universityId;
        this.universityNumber = universityNumber;
        this.password = password;
        this.enabled = enabled;
        this.authorities = authorities;
    }

    public static UserPrincipal fromUser(User user) {
        List<SimpleGrantedAuthority> auths = user.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.name()))
                .collect(Collectors.toList());

        return new UserPrincipal(
                user.getId(),
                user.getUniversityId(),
                user.getUniversityNumber(),
                user.getPasswordHash(),
                user.getStatus() == sa.edu.fbsu.campus.identity.domain.UserStatus.ACTIVE,
                auths
        );
    }

    public static UserPrincipal fromClaims(
            UUID userId,
            UUID universityId,
            String universityNumber,
            List<String> roleStrings
    ) {
        List<SimpleGrantedAuthority> auths = roleStrings.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new UserPrincipal(userId, universityId, universityNumber, "", true, auths);
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getUniversityId() {
        return universityId;
    }

    public String getUniversityNumber() {
        return universityNumber;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return universityNumber;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
