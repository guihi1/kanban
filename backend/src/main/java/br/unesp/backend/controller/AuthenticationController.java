package br.unesp.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unesp.backend.model.AuthenticationDTO;
import br.unesp.backend.model.LoginResponseDTO;
import br.unesp.backend.model.RegisterDTO;
import br.unesp.backend.model.User;
import br.unesp.backend.model.UserRole;
import br.unesp.backend.repository.UserRepository;
import br.unesp.backend.security.TokenService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("auth")
@CrossOrigin
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository usuarioRepository;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody @Valid AuthenticationDTO data) {

        // É uma boa prática armazenarmos as senhas do usuário como HASH no banco de
        // dados.
        // Dessa maneira, caso haja um vazamento do BD, as senhas estarão criptografadas
        // e não poderão ser diretamente acessadas.
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.username(), data.password());

        try {
            var auth = this.authenticationManager.authenticate(usernamePassword);
            var token = tokenService.generateToken((User) auth.getPrincipal());

            return ResponseEntity.ok(new LoginResponseDTO(token));
        } catch (Exception e) {
            System.out.println("Erro:  ");
            System.out.println(e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody @Valid RegisterDTO data) {
        // Primeiro verifica se já não existe outro usuário cadastrado com o mesmo login
        if (this.usuarioRepository.findByUsername(data.username()) != null)
            return ResponseEntity.badRequest().build();

        // Caso não exista, vamos encriptar a senha para salvar no BD. A senha bruta do
        // usuário
        // NÃO DEVE SER INSERIDA NO BD POR MEDIDAS DE SEGURANÇA.

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        System.out.println(data.username());
        System.out.println(encryptedPassword);

        User newUser = new User(data.username(), encryptedPassword, UserRole.USER);

        this.usuarioRepository.save(newUser);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> me() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(403).build();
        }
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(user);
    }
}
