package com.matchme.config;

import com.matchme.services.AppUserDetailsService;
import com.matchme.services.JwtService;
import io.jsonwebtoken.JwtException;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final AppUserDetailsService userDetailsService;
    private final JwtService jwtService;
    // Store authenticated users by session ID for proper cleanup
    private final Map<String, UsernamePasswordAuthenticationToken> sessionAuthMap = new ConcurrentHashMap<>();

    public WebSocketConfig(AppUserDetailsService userDetailsService, JwtService jwtService) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(@NonNull ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authToken = accessor.getFirstNativeHeader("Authorization");
                    if (authToken != null && authToken.startsWith("Bearer ")) {
                        String jwt = authToken.substring(7);
                        try {
                            String userEmail = jwtService.extractUsername(jwt);
                            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                            if (jwtService.isTokenValid(jwt, userDetails)) {
                                UsernamePasswordAuthenticationToken authentication =
                                   new UsernamePasswordAuthenticationToken(
                                      userDetails, null, userDetails.getAuthorities()
                                   );
                                SecurityContextHolder.getContext().setAuthentication(authentication);
                                accessor.setUser(authentication);
                                
                                // Store authentication in session map for cleanup on disconnect
                                String sessionId = accessor.getSessionId();
                                if (sessionId != null) {
                                    sessionAuthMap.put(sessionId, authentication);
                                }
                            } else {
                                return null; // Token invalid
                            }
                        } catch (JwtException e) {
                            return null; // Token malformed or expired
                        }
                    } else {
                        return null; // No auth token, reject connection
                    }
                } else if (accessor != null && StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                    // Clean up authentication on disconnect
                    String sessionId = accessor.getSessionId();
                    if (sessionId != null) {
                        sessionAuthMap.remove(sessionId);
                        SecurityContextHolder.clearContext();
                    }
                } else if (accessor != null && StompCommand.MESSAGE.equals(accessor.getCommand())) {
                    // For MESSAGE commands, restore authentication from session map
                    String sessionId = accessor.getSessionId();
                    if (sessionId != null) {
                        UsernamePasswordAuthenticationToken authentication = sessionAuthMap.get(sessionId);
                        if (authentication != null) {
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            accessor.setUser(authentication);
                        } else {
                            return null; // No authentication found for session
                        }
                    } else {
                        return null; // No session ID
                    }
                }
                return message;
            }
        });
    }
}
