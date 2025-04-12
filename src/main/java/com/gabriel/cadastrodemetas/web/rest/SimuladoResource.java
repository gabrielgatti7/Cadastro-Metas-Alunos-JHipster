package com.gabriel.cadastrodemetas.web.rest;

import com.gabriel.cadastrodemetas.domain.Simulado;
import com.gabriel.cadastrodemetas.repository.SimuladoRepository;
import com.gabriel.cadastrodemetas.service.SimuladoService;
import com.gabriel.cadastrodemetas.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.gabriel.cadastrodemetas.domain.Simulado}.
 */
@RestController
@RequestMapping("/api/simulados")
public class SimuladoResource {

    private static final Logger LOG = LoggerFactory.getLogger(SimuladoResource.class);

    private static final String ENTITY_NAME = "simulado";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SimuladoService simuladoService;

    private final SimuladoRepository simuladoRepository;

    public SimuladoResource(SimuladoService simuladoService, SimuladoRepository simuladoRepository) {
        this.simuladoService = simuladoService;
        this.simuladoRepository = simuladoRepository;
    }

    /**
     * {@code POST  /simulados} : Create a new simulado.
     *
     * @param simulado the simulado to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new simulado, or with status {@code 400 (Bad Request)} if the simulado has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Simulado> createSimulado(@Valid @RequestBody Simulado simulado) throws URISyntaxException {
        LOG.debug("REST request to save Simulado : {}", simulado);
        if (simulado.getId() != null) {
            throw new BadRequestAlertException("A new simulado cannot already have an ID", ENTITY_NAME, "idexists");
        }
        simulado = simuladoService.save(simulado);
        return ResponseEntity.created(new URI("/api/simulados/" + simulado.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, simulado.getId().toString()))
            .body(simulado);
    }

    /**
     * {@code PUT  /simulados/:id} : Updates an existing simulado.
     *
     * @param id the id of the simulado to save.
     * @param simulado the simulado to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated simulado,
     * or with status {@code 400 (Bad Request)} if the simulado is not valid,
     * or with status {@code 500 (Internal Server Error)} if the simulado couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Simulado> updateSimulado(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Simulado simulado
    ) throws URISyntaxException {
        LOG.debug("REST request to update Simulado : {}, {}", id, simulado);
        if (simulado.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, simulado.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!simuladoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        simulado = simuladoService.update(simulado);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, simulado.getId().toString()))
            .body(simulado);
    }

    /**
     * {@code PATCH  /simulados/:id} : Partial updates given fields of an existing simulado, field will ignore if it is null
     *
     * @param id the id of the simulado to save.
     * @param simulado the simulado to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated simulado,
     * or with status {@code 400 (Bad Request)} if the simulado is not valid,
     * or with status {@code 404 (Not Found)} if the simulado is not found,
     * or with status {@code 500 (Internal Server Error)} if the simulado couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Simulado> partialUpdateSimulado(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Simulado simulado
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Simulado partially : {}, {}", id, simulado);
        if (simulado.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, simulado.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!simuladoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Simulado> result = simuladoService.partialUpdate(simulado);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, simulado.getId().toString())
        );
    }

    /**
     * {@code GET  /simulados} : get all the simulados.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of simulados in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Simulado>> getAllSimulados(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Simulados");
        Page<Simulado> page = simuladoService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /simulados/:id} : get the "id" simulado.
     *
     * @param id the id of the simulado to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the simulado, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Simulado> getSimulado(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Simulado : {}", id);
        Optional<Simulado> simulado = simuladoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(simulado);
    }

    /**
     * {@code DELETE  /simulados/:id} : delete the "id" simulado.
     *
     * @param id the id of the simulado to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSimulado(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Simulado : {}", id);
        simuladoService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
