package br.unesp.backend.repository;
import org.springframework.data.repository.CrudRepository;

import br.unesp.backend.model.User;

public interface UserRepository extends CrudRepository<User, Long>{

}