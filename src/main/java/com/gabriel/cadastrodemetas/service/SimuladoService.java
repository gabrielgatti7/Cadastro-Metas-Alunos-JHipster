package com.gabriel.cadastrodemetas.service;

import com.gabriel.cadastrodemetas.domain.Simulado;
import com.gabriel.cadastrodemetas.repository.SimuladoRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.gabriel.cadastrodemetas.domain.Simulado}.
 */
@Service
@Transactional
public class SimuladoService {

    private static final Logger LOG = LoggerFactory.getLogger(SimuladoService.class);

    private final SimuladoRepository simuladoRepository;

    public SimuladoService(SimuladoRepository simuladoRepository) {
        this.simuladoRepository = simuladoRepository;
    }

    /**
     * Save a simulado.
     *
     * @param simulado the entity to save.
     * @return the persisted entity.
     */
    public Simulado save(Simulado simulado) {
        LOG.debug("Request to save Simulado : {}", simulado);
        return simuladoRepository.save(simulado);
    }

    /**
     * Update a simulado.
     *
     * @param simulado the entity to save.
     * @return the persisted entity.
     */
    public Simulado update(Simulado simulado) {
        LOG.debug("Request to update Simulado : {}", simulado);
        return simuladoRepository.save(simulado);
    }

    /**
     * Partially update a simulado.
     *
     * @param simulado the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Simulado> partialUpdate(Simulado simulado) {
        LOG.debug("Request to partially update Simulado : {}", simulado);

        return simuladoRepository
            .findById(simulado.getId())
            .map(existingSimulado -> {
                if (simulado.getNome() != null) {
                    existingSimulado.setNome(simulado.getNome());
                }

                return existingSimulado;
            })
            .map(simuladoRepository::save);
    }

    /**
     * Get all the simulados.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Simulado> findAll(Pageable pageable) {
        LOG.debug("Request to get all Simulados");
        return simuladoRepository.findAll(pageable);
    }

    /**
     * Get one simulado by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Simulado> findOne(Long id) {
        LOG.debug("Request to get Simulado : {}", id);
        return simuladoRepository.findById(id);
    }

    /**
     * Delete the simulado by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Simulado : {}", id);
        simuladoRepository.deleteById(id);
    }
}
