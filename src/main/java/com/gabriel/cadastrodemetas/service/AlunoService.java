package com.gabriel.cadastrodemetas.service;

import com.gabriel.cadastrodemetas.domain.Aluno;
import com.gabriel.cadastrodemetas.domain.Authority;
import com.gabriel.cadastrodemetas.domain.User;
import com.gabriel.cadastrodemetas.repository.AlunoRepository;
import com.gabriel.cadastrodemetas.repository.AuthorityRepository;
import com.gabriel.cadastrodemetas.repository.UserRepository;
import com.gabriel.cadastrodemetas.security.AuthoritiesConstants;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

/**
 * Service Implementation for managing {@link com.gabriel.cadastrodemetas.domain.Aluno}.
 */
@Service
@Transactional
public class AlunoService {

    private static final Logger LOG = LoggerFactory.getLogger(AlunoService.class);

    private final AlunoRepository alunoRepository;
    private final AuthorityRepository authorityRepository;
    private final UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AlunoService(
        AlunoRepository alunoRepository,
        AuthorityRepository authorityRepository,
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.alunoRepository = alunoRepository;
        this.authorityRepository = authorityRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Save a aluno.
     *
     * @param aluno the entity to save.
     * @return the persisted entity.
     */
    @Transactional
    public Aluno save(Aluno aluno) {
        LOG.debug("Request to save Aluno : {}", aluno);

        if (aluno.getUser() == null) {
            User user = new User();
            user.setLogin(aluno.getEmail()); // Login will be the email
            user.setEmail(aluno.getEmail());
            user.setFirstName(aluno.getNome());
            user.setPassword(passwordEncoder.encode("123456"));
            user.setActivated(true);
            user.setLangKey("pt-br");

            // Defining the USER role
            Set<Authority> authorities = new HashSet<>();
            authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
            user.setAuthorities(authorities);

            user = userRepository.save(user);
            aluno.setUser(user);
        }

        return alunoRepository.save(aluno);
    }

    /**
     * Update a aluno.
     *
     * @param aluno the entity to save.
     * @return the persisted entity.
     */
    public Aluno update(Aluno aluno) {
        LOG.debug("Request to update Aluno : {}", aluno);
        return alunoRepository.save(aluno);
    }

    /**
     * Partially update a aluno.
     *
     * @param aluno the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Aluno> partialUpdate(Aluno aluno) {
        LOG.debug("Request to partially update Aluno : {}", aluno);

        return alunoRepository
            .findById(aluno.getId())
            .map(existingAluno -> {
                if (aluno.getNome() != null) {
                    existingAluno.setNome(aluno.getNome());
                }
                if (aluno.getEmail() != null) {
                    existingAluno.setEmail(aluno.getEmail());
                }

                return existingAluno;
            })
            .map(alunoRepository::save);
    }

    /**
     * Get all the alunos.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Aluno> findAll() {
        LOG.debug("Request to get all Alunos");
        return alunoRepository.findAll();
    }

    /**
     * Get all the alunos with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Aluno> findAllWithEagerRelationships(Pageable pageable) {
        return alunoRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one aluno by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Aluno> findOne(Long id) {
        LOG.debug("Request to get Aluno : {}", id);
        return alunoRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the aluno by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Aluno : {}", id);
        alunoRepository.deleteById(id);
    }
}
