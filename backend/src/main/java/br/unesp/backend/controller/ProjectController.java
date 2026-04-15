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

import br.unesp.backend.model.Project;
import br.unesp.backend.repository.ProjectRepository;

@Controller("ProjectController")
@RequestMapping(value = "/project")
public class ProjectController {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Project> getProject(@PathVariable(value = "id") Long id){
        
        Optional<Project> project = projectRepository.findById(id);
        
        return new ResponseEntity<>(project.get(), HttpStatus.OK);
    }

    @GetMapping(value = "/", produces = "application/json")
    public ResponseEntity<ArrayList<Project>> getAllProjects(){
        ArrayList<Project> allProjects = (ArrayList<Project>) projectRepository.findAll();

        return new ResponseEntity<>(allProjects,HttpStatus.OK);
    }

    @PostMapping(value= "/", produces = "application/json")
    public ResponseEntity<Project> registerProject(@RequestBody Project project){

        Project newProject = projectRepository.save(project);
        
        return new ResponseEntity<>(newProject, HttpStatus.OK);
    }

    @PutMapping(value= "/", produces = "application/json")
    public ResponseEntity<Project> updateProject(@RequestBody Project project){

        Project updatedProject = projectRepository.save(project);
        
        return new ResponseEntity<>(updatedProject, HttpStatus.OK);
    }

    @DeleteMapping(value= "/{id}", produces = "application/json")
    public ResponseEntity<Object> deleteProject(@PathVariable(value = "id") Long id){

        projectRepository.deleteById(id);;
        
        return new ResponseEntity<>(HttpStatus.OK);
    }
};
