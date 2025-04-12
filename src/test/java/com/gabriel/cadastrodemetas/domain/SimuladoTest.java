package com.gabriel.cadastrodemetas.domain;

import static com.gabriel.cadastrodemetas.domain.NotaTestSamples.*;
import static com.gabriel.cadastrodemetas.domain.SimuladoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gabriel.cadastrodemetas.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SimuladoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Simulado.class);
        Simulado simulado1 = getSimuladoSample1();
        Simulado simulado2 = new Simulado();
        assertThat(simulado1).isNotEqualTo(simulado2);

        simulado2.setId(simulado1.getId());
        assertThat(simulado1).isEqualTo(simulado2);

        simulado2 = getSimuladoSample2();
        assertThat(simulado1).isNotEqualTo(simulado2);
    }

    @Test
    void notaTest() {
        Simulado simulado = getSimuladoRandomSampleGenerator();
        Nota notaBack = getNotaRandomSampleGenerator();

        simulado.addNota(notaBack);
        assertThat(simulado.getNotas()).containsOnly(notaBack);
        assertThat(notaBack.getSimulado()).isEqualTo(simulado);

        simulado.removeNota(notaBack);
        assertThat(simulado.getNotas()).doesNotContain(notaBack);
        assertThat(notaBack.getSimulado()).isNull();

        simulado.notas(new HashSet<>(Set.of(notaBack)));
        assertThat(simulado.getNotas()).containsOnly(notaBack);
        assertThat(notaBack.getSimulado()).isEqualTo(simulado);

        simulado.setNotas(new HashSet<>());
        assertThat(simulado.getNotas()).doesNotContain(notaBack);
        assertThat(notaBack.getSimulado()).isNull();
    }
}
