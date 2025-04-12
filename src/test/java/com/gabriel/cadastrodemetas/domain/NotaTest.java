package com.gabriel.cadastrodemetas.domain;

import static com.gabriel.cadastrodemetas.domain.AlunoTestSamples.*;
import static com.gabriel.cadastrodemetas.domain.NotaTestSamples.*;
import static com.gabriel.cadastrodemetas.domain.SimuladoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gabriel.cadastrodemetas.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class NotaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Nota.class);
        Nota nota1 = getNotaSample1();
        Nota nota2 = new Nota();
        assertThat(nota1).isNotEqualTo(nota2);

        nota2.setId(nota1.getId());
        assertThat(nota1).isEqualTo(nota2);

        nota2 = getNotaSample2();
        assertThat(nota1).isNotEqualTo(nota2);
    }

    @Test
    void alunoTest() {
        Nota nota = getNotaRandomSampleGenerator();
        Aluno alunoBack = getAlunoRandomSampleGenerator();

        nota.setAluno(alunoBack);
        assertThat(nota.getAluno()).isEqualTo(alunoBack);

        nota.aluno(null);
        assertThat(nota.getAluno()).isNull();
    }

    @Test
    void simuladoTest() {
        Nota nota = getNotaRandomSampleGenerator();
        Simulado simuladoBack = getSimuladoRandomSampleGenerator();

        nota.setSimulado(simuladoBack);
        assertThat(nota.getSimulado()).isEqualTo(simuladoBack);

        nota.simulado(null);
        assertThat(nota.getSimulado()).isNull();
    }
}
