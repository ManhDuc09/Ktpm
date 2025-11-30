package com.flogin.backend.login;

import com.flogin.backend.controller.AuthController;
import com.flogin.backend.dto.UserDTO;
import com.flogin.backend.dto.UserResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) 

class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    
    private UserService userService;


    @Test
    void testCheckUserExists_true() throws Exception {
        UserDTO dto = new UserDTO();
        dto.setEmail("test@mail.com");

        when(userService.findByEmail("test@mail.com"))
                .thenReturn(Optional.of(new User()));

        mockMvc.perform(post("/api/auth/exists")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@mail.com\"}"))
                .andExpect(status().isOk());

        verify(userService).findByEmail("test@mail.com");
    }


    @Test
    void testCheckUserExists_false() throws Exception {
        when(userService.findByEmail("missing@mail.com"))
                .thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/exists")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"missing@mail.com\"}"))
                .andExpect(status().isNotFound());

        verify(userService).findByEmail("missing@mail.com");
    }



    @Test
    void testRegisterSuccess() throws Exception {
        UserResponse response = new UserResponse(1L, "John", "john@mail.com");

        when(userService.register(any(UserDTO.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"name":"John","email":"john@mail.com","password":"123456"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john@mail.com"));

        verify(userService, times(1)).register(any(UserDTO.class));
    }


    @Test
    void testLoginSuccess() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setEmail("login@mail.com");
        user.setPassword("encoded");

        when(userService.login("login@mail.com", "123456"))
                .thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"email":"login@mail.com","password":"123456"}
                        """))
                .andExpect(status().isOk());

        verify(userService).login("login@mail.com", "123456");
    }


    @Test
    void testLoginFailure() throws Exception {
        when(userService.login("wrong@mail.com", "badpass"))
                .thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"email":"wrong@mail.com","password":"badpass"}
                        """))
                .andExpect(status().isUnauthorized());

        verify(userService).login("wrong@mail.com", "badpass");
    }

}
