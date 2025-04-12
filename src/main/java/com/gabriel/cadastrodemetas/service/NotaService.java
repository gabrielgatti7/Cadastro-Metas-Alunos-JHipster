package com.gabriel.cadastrodemetas.service;

import com.gabriel.cadastrodemetas.domain.Nota;
import com.gabriel.cadastrodemetas.repository.NotaRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.gabriel.cadastrodemetas.domain.Nota}.
 */
@Service
@Transactional
public class NotaService {

    private static final Logger LOG = LoggerFactory.getLogger(NotaService.class);

    private final NotaRepository notaRepository;

    public NotaService(NotaRepository notaRepository) {
        this.notaRepository = notaRepository;
    }

    /**
     * Save a nota.
     *
     * @param nota the entity to save.
     * @return the persisted entity.
     */
    public Nota save(Nota nota) {
        LOG.debug("Request to save Nota : {}", nota);
        return notaRepository.save(nota);
    }

    /**
     * Update a nota.
     *
     * @param nota the entity to save.
     * @return the persisted entity.
     */
    public Nota update(Nota nota) {
        LOG.debug("Request to update Nota : {}", nota);
        return notaRepository.save(nota);
    }

    /**
     * Partially update a nota.
     *
     * @param nota the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Nota> partialUpdate(Nota nota) {
        LOG.debug("Request to partially update Nota : {}", nota);

        return notaRepository
            .findById(nota.getId())
            .map(existingNota -> {
                if (nota.getValor() != null) {
                    existingNota.setValor(nota.getValor());
                }
                if (nota.getArea() != null) {
                    existingNota.setArea(nota.getArea());
                }

                return existingNota;
            })
            .map(notaRepository::save);
    }

    /**
     * Get all the notas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Nota> findAll(Pageable pageable) {
        LOG.debug("Request to get all Notas");
        return notaRepository.findAll(pageable);
    }

    /**
     * Get all the notas with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Nota> findAllWithEagerRelationships(Pageable pageable) {
        return notaRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one nota by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Nota> findOne(Long id) {
        LOG.debug("Request to get Nota : {}", id);
        return notaRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the nota by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Nota : {}", id);
        notaRepository.deleteById(id);
    }
}
