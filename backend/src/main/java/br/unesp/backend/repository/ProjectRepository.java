package br.unesp.backend.repository;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;

import br.unesp.backend.model.Project;

public interface ProjectRepository extends CrudRepository<Project, Long>{

    public ArrayList<Project> findByOwnerId(Long userId);

}