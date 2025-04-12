package com.gabriel.cadastrodemetas.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Simulado.
 */
@Entity
@Table(name = "simulado")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Simulado implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "nome", length = 100, nullable = false)
    private String nome;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "simulado")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "aluno", "simulado" }, allowSetters = true)
    private Set<Nota> notas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Simulado id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Simulado nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Nota> getNotas() {
        return this.notas;
    }

    public void setNotas(Set<Nota> notas) {
        if (this.notas != null) {
            this.notas.forEach(i -> i.setSimulado(null));
        }
        if (notas != null) {
            notas.forEach(i -> i.setSimulado(this));
        }
        this.notas = notas;
    }

    public Simulado notas(Set<Nota> notas) {
        this.setNotas(notas);
        return this;
    }

    public Simulado addNota(Nota nota) {
        this.notas.add(nota);
        nota.setSimulado(this);
        return this;
    }

    public Simulado removeNota(Nota nota) {
        this.notas.remove(nota);
        nota.setSimulado(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Simulado)) {
            return false;
        }
        return getId() != null && getId().equals(((Simulado) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Simulado{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
