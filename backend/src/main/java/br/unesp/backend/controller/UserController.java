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
import org.springframework.web.bind.annotation.RequestParam;

import br.unesp.backend.model.User;
import br.unesp.backend.repository.UserRepository;

@Controller("UserController")
@RequestMapping(value = "/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity getUser(@PathVariable(value = "id") Long id) {

        Optional<User> user = userRepository.findById(id);
        return new ResponseEntity(user.get(),HttpStatus.OK);

    }

    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity getAllUsers() {

        ArrayList<User>  allUsers = (ArrayList<User>)userRepository.findAll();
        return new ResponseEntity(allUsers, HttpStatus.OK);

    }

    @PostMapping(value="/", produces = "application/json")
    public ResponseEntity<User> registerUser(@RequestBody User user){

        User newUser = userRepository.save(user);
        return new ResponseEntity<User>(newUser,HttpStatus.OK);
    }

    @PutMapping(value="/", produces = "application/json")
    public ResponseEntity<User> atualizar(@RequestBody User user){

        User updatedUser = userRepository.save(user);
        return new ResponseEntity<User>(updatedUser,HttpStatus.OK);
    }

    @DeleteMapping(value="/{id}", produces= "application/json")
    public ResponseEntity<User> atualizar(@PathVariable("id") Long id){

        userRepository.deleteById((id));
        return new ResponseEntity("ok",HttpStatus.OK);
    }
}
