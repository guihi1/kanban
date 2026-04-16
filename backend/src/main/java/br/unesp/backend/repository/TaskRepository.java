package br.unesp.backend.repository;

import org.springframework.data.repository.CrudRepository;

import br.unesp.backend.model.Task;

public interface TaskRepository extends CrudRepository<Task, Long> {
    
}
