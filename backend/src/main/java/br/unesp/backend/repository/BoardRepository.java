package br.unesp.backend.repository;

import org.springframework.data.repository.CrudRepository;

import br.unesp.backend.model.Board;

public interface BoardRepository extends CrudRepository<Board, Long>{
    
}
