package br.unesp.backend.repository;

import org.springframework.data.repository.CrudRepository;

import br.unesp.backend.model.Project;

public interface ProjectRepository extends CrudRepository<Project, Long>{

}