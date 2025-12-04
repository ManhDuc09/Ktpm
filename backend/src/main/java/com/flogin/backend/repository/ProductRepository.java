package com.flogin.backend.repository;

import com.flogin.backend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUser(User user);

    Optional<Product> findById(Long id);


}
