package com.gabriel.cadastrodemetas.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gabriel.cadastrodemetas.domain.enumeration.AreaDoEnem;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Nota.
 */
@Entity
@Table(name = "nota")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Nota implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Max(value = 2000)
    @Column(name = "valor", nullable = false)
    private Integer valor;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "area", nullable = false)
    private AreaDoEnem area;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "user", "metas", "notas" }, allowSetters = true)
    private Aluno aluno;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "notas" }, allowSetters = true)
    private Simulado simulado;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Nota id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getValor() {
        return this.valor;
    }

    public Nota valor(Integer valor) {
        this.setValor(valor);
        return this;
    }

    public void setValor(Integer valor) {
        this.valor = valor;
    }

    public AreaDoEnem getArea() {
        return this.area;
    }

    public Nota area(AreaDoEnem area) {
        this.setArea(area);
        return this;
    }

    public void setArea(AreaDoEnem area) {
        this.area = area;
    }

    public Aluno getAluno() {
        return this.aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Nota aluno(Aluno aluno) {
        this.setAluno(aluno);
        return this;
    }

    public Simulado getSimulado() {
        return this.simulado;
    }

    public void setSimulado(Simulado simulado) {
        this.simulado = simulado;
    }

    public Nota simulado(Simulado simulado) {
        this.setSimulado(simulado);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Nota)) {
            return false;
        }
        return getId() != null && getId().equals(((Nota) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Nota{" +
            "id=" + getId() +
            ", valor=" + getValor() +
            ", area='" + getArea() + "'" +
            "}";
    }
}
