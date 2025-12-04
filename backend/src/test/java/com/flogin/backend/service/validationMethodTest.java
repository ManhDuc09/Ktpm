package com.flogin.backend.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;

class ValidationMethodTest {
    @Test
    void usernameNull_shouldThrow() {
        Exception ex = assertThrows(IllegalArgumentException.class,
            () -> ValidationMethod.validateLoginInput(null, "abc"));
        assertEquals("Username is required", ex.getMessage());
    }

    @Test
    void usernameEmpty_shouldThrow() {
        Exception ex = assertThrows(IllegalArgumentException.class,
            () -> ValidationMethod.validateLoginInput("", "abc"));
        assertEquals("Username is required", ex.getMessage());
    }

    @Test
    void passwordNull_shouldThrow() {
        Exception ex = assertThrows(IllegalArgumentException.class,
            () -> ValidationMethod.validateLoginInput("user", null));
        assertEquals("Password is required", ex.getMessage());
    }

    @Test
    void passwordEmpty_shouldThrow() {
        Exception ex = assertThrows(IllegalArgumentException.class,
            () -> ValidationMethod.validateLoginInput("user", ""));
        assertEquals("Password is required", ex.getMessage());
    }

    @Test
    void validInput_shouldNotThrow() {
        assertDoesNotThrow(() -> ValidationMethod.validateLoginInput("user", "abc"));
    }
}
