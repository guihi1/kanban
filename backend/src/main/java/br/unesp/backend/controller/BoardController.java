package br.unesp.backend.controller;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import br.unesp.backend.model.Board;
import br.unesp.backend.repository.BoardRepository;

@Controller("BoardController")
@RequestMapping(value="/board")
public class BoardController {
    
    @Autowired
    private BoardRepository boardRepository;

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Board> getBoard(@PathVariable(value = "id") Long id){
        
        Optional<Board> board = boardRepository.findById(id);
        return new ResponseEntity<>(board.get(), HttpStatus.OK);
    }

    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<ArrayList<Board>> getAllBoards(){
        
        ArrayList<Board> allBoards = (ArrayList<Board>) boardRepository.findAll();
        return new ResponseEntity<>(allBoards, HttpStatus.OK);
    }

    @PostMapping(value = "/", produces = "application/json")
    public ResponseEntity<Board> registerBoard(@RequestBody Board board){
        
        Board newBoard = boardRepository.save(board);
        return new ResponseEntity<>(newBoard, HttpStatus.OK); 
    }

    @PutMapping(value = "/", produces = "application/json")
    public ResponseEntity<Board> updateBoard(@RequestBody Board board){
        
        Board updatedBoard = boardRepository.save(board);
        return new ResponseEntity<>(updatedBoard, HttpStatus.OK); 
    }

    @DeleteMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Object> deleteBoard(@PathVariable(value = "id") Long id){
        
        boardRepository.deleteById(id);

        return new ResponseEntity<>("ok", HttpStatus.OK);
    }
}
