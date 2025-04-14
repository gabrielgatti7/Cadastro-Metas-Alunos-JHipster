package com.gabriel.cadastrodemetas.web.rest;

import com.gabriel.cadastrodemetas.domain.Nota;
import com.gabriel.cadastrodemetas.repository.NotaRepository;
import com.gabriel.cadastrodemetas.service.NotaService;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.gabriel.cadastrodemetas.domain.Nota}.
 */
@RestController
@RequestMapping("/api/notas")
public class NotaResource {

    private static final Logger LOG = LoggerFactory.getLogger(NotaResource.class);

    private static final String ENTITY_NAME = "nota";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NotaService notaService;

    private final NotaRepository notaRepository;

    public NotaResource(NotaService notaService, NotaRepository notaRepository) {
        this.notaService = notaService;
        this.notaRepository = notaRepository;
    }

    /**
     * {@code POST  /notas} : Create a new nota.
     *
     * @param nota the nota to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new nota, or with status {@code 400 (Bad Request)} if the nota has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Nota> createNota(@Valid @RequestBody Nota nota) throws URISyntaxException {
        LOG.debug("REST request to save Nota : {}", nota);
        if (nota.getId() != null) {
            throw new BadRequestAlertException("A new nota cannot already have an ID", ENTITY_NAME, "idexists");
        }
        nota = notaService.save(nota);
        return ResponseEntity.created(new URI("/api/notas/" + nota.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, nota.getId().toString()))
            .body(nota);
    }

    /**
     * {@code PUT  /notas/:id} : Updates an existing nota.
     *
     * @param id the id of the nota to save.
     * @param nota the nota to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nota,
     * or with status {@code 400 (Bad Request)} if the nota is not valid,
     * or with status {@code 500 (Internal Server Error)} if the nota couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Nota> updateNota(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Nota nota)
        throws URISyntaxException {
        LOG.debug("REST request to update Nota : {}, {}", id, nota);
        if (nota.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nota.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        nota = notaService.update(nota);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, nota.getId().toString()))
            .body(nota);
    }

    /**
     * {@code PATCH  /notas/:id} : Partial updates given fields of an existing nota, field will ignore if it is null
     *
     * @param id the id of the nota to save.
     * @param nota the nota to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nota,
     * or with status {@code 400 (Bad Request)} if the nota is not valid,
     * or with status {@code 404 (Not Found)} if the nota is not found,
     * or with status {@code 500 (Internal Server Error)} if the nota couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Nota> partialUpdateNota(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Nota nota
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Nota partially : {}, {}", id, nota);
        if (nota.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, nota.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Nota> result = notaService.partialUpdate(nota);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, nota.getId().toString())
        );
    }

    /**
     * {@code GET  /notas} : get all the notas.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of notas in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Nota>> getAllNotas(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of Notas");
        Page<Nota> page;
        if (eagerload) {
            page = notaService.findAllWithEagerRelationships(pageable);
        } else {
            page = notaService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /notas/:id} : get the "id" nota.
     *
     * @param id the id of the nota to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the nota, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Nota> getNota(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Nota : {}", id);
        Optional<Nota> nota = notaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(nota);
    }

    /**
     * {@code DELETE  /notas/:id} : delete the "id" nota.
     *
     * @param id the id of the nota to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteNota(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Nota : {}", id);
        notaService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
