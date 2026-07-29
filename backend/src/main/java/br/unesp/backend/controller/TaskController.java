package br.unesp.backend.controller;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unesp.backend.model.Tag;
import br.unesp.backend.model.Task;
import br.unesp.backend.repository.TagRepository;
import br.unesp.backend.repository.TaskRepository;

@RestController("TaskController")
@RequestMapping(value = "/task")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TagRepository tagRepository;

    private void saveTransientTags(Task task) {
        if (task.getTags() != null) {
            for (Tag tag : task.getTags()) {
                if (tag.getId() == null) {
                    tagRepository.save(tag);
                }
            }
        }
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Task> getTask(@PathVariable(value = "id") Long id) {

        Optional<Task> task = taskRepository.findById(id);
        return new ResponseEntity<>(task.get(), HttpStatus.OK);
    }

    @GetMapping(value = {"", "/"}, produces = "application/json")
    public ResponseEntity<ArrayList<Task>> getAllTasks() {

        ArrayList<Task> allTasks = (ArrayList<Task>) taskRepository.findAll();
        return new ResponseEntity<>(allTasks, HttpStatus.OK);
    }

    @PostMapping(value = {"", "/"})
    public ResponseEntity<Task> registerTask(@RequestBody Task task) {
        if (task.getCreationDate() == null) {
            task.setCreationDate(new java.util.Date());
        }

        saveTransientTags(task);

        Task newTask = taskRepository.save(task);
        return new ResponseEntity<>(newTask, HttpStatus.CREATED);
    }

    @PutMapping(value = "/", produces = "application/json")
    public ResponseEntity<Task> updateTask(@RequestBody Task task) {

        saveTransientTags(task);

        Task updatedTask = taskRepository.save(task);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Object> deleteTask(@PathVariable(value = "id") Long id) {

        taskRepository.deleteById(id);
        return new ResponseEntity<>("ok", HttpStatus.OK);
    }
}
