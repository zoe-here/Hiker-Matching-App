package com.matchme.entities;

import jakarta.persistence.*;

// Ensure the dismissed user will not be recommended to the user again
@Entity
@Table(name = "dismissals")
public class Dismissal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who performs the dismissal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    // The user who is being dismissed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dismissed_user_id", nullable = false)
    private Profile dismissedUser;

    public Dismissal() {}

    public Dismissal(Profile user, Profile dismissedUser) {
        this.user = user;
        this.dismissedUser = dismissedUser;
    }

    public Long getId() {
        return id;
    }
    public Profile getUser() {
        return user;
    }
    public void setUser(Profile user) {
        this.user = user;
    }
    public Profile getDismissedUser() {
        return dismissedUser;
    }
    public void setDismissedUser(Profile dismissedUser) {
        this.dismissedUser = dismissedUser;
    }
}
