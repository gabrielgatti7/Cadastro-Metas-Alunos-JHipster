package com.gabriel.cadastrodemetas.web.rest;

import static com.gabriel.cadastrodemetas.domain.SimuladoAsserts.*;
import static com.gabriel.cadastrodemetas.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gabriel.cadastrodemetas.IntegrationTest;
import com.gabriel.cadastrodemetas.domain.Simulado;
import com.gabriel.cadastrodemetas.repository.SimuladoRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SimuladoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SimuladoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/simulados";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SimuladoRepository simuladoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSimuladoMockMvc;

    private Simulado simulado;

    private Simulado insertedSimulado;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Simulado createEntity() {
        return new Simulado().nome(DEFAULT_NOME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Simulado createUpdatedEntity() {
        return new Simulado().nome(UPDATED_NOME);
    }

    @BeforeEach
    void initTest() {
        simulado = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedSimulado != null) {
            simuladoRepository.delete(insertedSimulado);
            insertedSimulado = null;
        }
    }

    @Test
    @Transactional
    void createSimulado() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Simulado
        var returnedSimulado = om.readValue(
            restSimuladoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(simulado)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Simulado.class
        );

        // Validate the Simulado in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSimuladoUpdatableFieldsEquals(returnedSimulado, getPersistedSimulado(returnedSimulado));

        insertedSimulado = returnedSimulado;
    }

    @Test
    @Transactional
    void createSimuladoWithExistingId() throws Exception {
        // Create the Simulado with an existing ID
        simulado.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSimuladoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(simulado)))
            .andExpect(status().isBadRequest());

        // Validate the Simulado in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        simulado.setNome(null);

        // Create the Simulado, which fails.

        restSimuladoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(simulado)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSimulados() throws Exception {
        // Initialize the database
        insertedSimulado = simuladoRepository.saveAndFlush(simulado);

        // Get all the simuladoList
        restSimuladoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(simulado.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getSimulado() throws Exception {
        // Initialize the database
        insertedSimulado = simuladoRepository.saveAndFlush(simulado);

        // Get the simulado
        restSimuladoMockMvc
            .perform(get(ENTITY_API_URL_ID, simulado.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(simulado.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingSimulado() throws Exception {
        // Get the simulado
        restSimuladoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSimulado() throws Exception {
        // Initialize the database
        insertedSimulado = simuladoRepository.saveAndFlush(simulado);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the simulado
        Simulado updatedSimulado = simuladoRepository.findById(simulado.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSimulado are not directly saved in db
        em.detach(updatedSimulado);
        updatedSimulado.nome(UPDATED_NOME);

        restSimuladoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSimulado.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSimulado))
            )
            .andExpect(status().isOk());

        // Validate the Simulado in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSimuladoToMatchAllProperties(updatedSimulado);
    }

    @Test
    @Transactional
    void putNonExistingSimulado() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        simulado.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSimuladoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, simulado.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(simulado))
            )
            .andExpect(status().isBadRequest());

        // Validate the Simulado in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSimulado() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        simulado.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSimuladoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(simulado))
            )
            .andExpect(status().isBadRequest());

        // Validate the Simulado in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSimulado() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        simulado.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSimuladoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(simulado)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Simulado in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSimuladoWithPatch() throws Exception {
        // Initialize the database
        insertedSimulado = simuladoRepository.saveAndFlush(simulado);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the simulado using partial update
        Simulado partialUpdatedSimulado = new Simulado();
        partialUpdatedSimulado.setId(simulado.getId());

        partialUpdatedSimulado.nome(UPDATED_NOME);

        restSimuladoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSimulado.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSimulado))
            )
            .andExpect(status().isOk());

        // Validate the Simulado in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSimuladoUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedSimulado, simulado), getPersistedSimulado(simulado));
    }

    @Test
    @Transactional
    void fullUpdateSimuladoWithPatch() throws Exception {
        // Initialize the database
        insertedSimulado = simuladoRepository.saveAndFlush(simulado);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the simulado using partial update
        Simulado partialUpdatedSimulado = new Simulado();
        partialUpdatedSimulado.setId(simulado.getId());

        partialUpdatedSimulado.nome(UPDATED_NOME);

        restSimuladoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSimulado.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSimulado))
            )
            .andExpect(status().isOk());

        // Validate the Simulado in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSimuladoUpdatableFieldsEquals(partialUpdatedSimulado, getPersistedSimulado(partialUpdatedSimulado));
    }

    @Test
    @Transactional
    void patchNonExistingSimulado() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        simulado.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSimuladoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, simulado.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(simulado))
            )
            .andExpect(status().isBadRequest());

        // Validate the Simulado in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSimulado() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        simulado.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSimuladoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(simulado))
            )
            .andExpect(status().isBadRequest());

        // Validate the Simulado in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSimulado() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        simulado.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSimuladoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(simulado)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Simulado in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSimulado() throws Exception {
        // Initialize the database
        insertedSimulado = simuladoRepository.saveAndFlush(simulado);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the simulado
        restSimuladoMockMvc
            .perform(delete(ENTITY_API_URL_ID, simulado.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return simuladoRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Simulado getPersistedSimulado(Simulado simulado) {
        return simuladoRepository.findById(simulado.getId()).orElseThrow();
    }

    protected void assertPersistedSimuladoToMatchAllProperties(Simulado expectedSimulado) {
        assertSimuladoAllPropertiesEquals(expectedSimulado, getPersistedSimulado(expectedSimulado));
    }

    protected void assertPersistedSimuladoToMatchUpdatableProperties(Simulado expectedSimulado) {
        assertSimuladoAllUpdatablePropertiesEquals(expectedSimulado, getPersistedSimulado(expectedSimulado));
    }
}
