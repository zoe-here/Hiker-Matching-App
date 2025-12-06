package com.matchme.services;

import com.matchme.entities.Profile;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {
    private final Long id;
    private final String email;
    private final String password;
    private final String firstName;
    private final String lastName;

    public CustomUserDetails(Profile profile) {
        this.id = profile.getId();
        this.email = profile.getEmail();
        this.password = profile.getPassword();
        this.firstName = profile.getFirstName();
        this.lastName = profile.getLastName();
    }

    public Long getId() {
        return id;
    }
    @Override
    // In Spring Security, the term "username" is used generically to mean
    // the unique identifier for a user during authentication
    public String getUsername() {
        return email;
    }
    @Override
    public String getPassword() {
        return password;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

}
