package br.unesp.backend.repository;

import org.springframework.data.repository.CrudRepository;

import br.unesp.backend.model.Tag;

public interface TagRepository extends CrudRepository<Tag, Long>{
    
}
