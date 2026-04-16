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

import br.unesp.backend.model.Tag;
import br.unesp.backend.repository.TagRepository;

@Controller("TagController")
@RequestMapping(value = "/tag")
public class TagController {
    
    @Autowired
    public TagRepository tagRepository;

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Tag> getTag(@PathVariable(value = "id") Long id){

        Optional<Tag> tag = tagRepository.findById(id);
        return new ResponseEntity<>(tag.get(), HttpStatus.OK);
    }

    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<ArrayList<Tag>> getAllTags(){

        ArrayList<Tag> allTags = (ArrayList<Tag>) tagRepository.findAll();
        return new ResponseEntity<>(allTags, HttpStatus.OK);
    }

    @PostMapping(value = "/", produces = "application/json")
    public ResponseEntity<Tag> registerTag(@RequestBody Tag tag){

        Tag newTag = tagRepository.save(tag);
        return new ResponseEntity<>(newTag, HttpStatus.OK);
    }

    @PutMapping(value = "/", produces = "application/json")
    public ResponseEntity<Tag> updateTag(@RequestBody Tag tag){

        Tag updatedTag = tagRepository.save(tag);
        return new ResponseEntity<>(updatedTag, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Object> deleteTag(@PathVariable(value = "id") Long id){

        tagRepository.deleteById(id);
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }
}
