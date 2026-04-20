package br.unesp.backend.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.security.core.userdetails.UserDetails;

import br.unesp.backend.model.User;

public interface UserRepository extends CrudRepository<User, Long> {
    UserDetails findByUsername(String username);
}