package com.gabriel.cadastrodemetas.domain;

import static com.gabriel.cadastrodemetas.domain.AlunoTestSamples.*;
import static com.gabriel.cadastrodemetas.domain.MetaTestSamples.*;
import static com.gabriel.cadastrodemetas.domain.NotaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.gabriel.cadastrodemetas.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AlunoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Aluno.class);
        Aluno aluno1 = getAlunoSample1();
        Aluno aluno2 = new Aluno();
        assertThat(aluno1).isNotEqualTo(aluno2);

        aluno2.setId(aluno1.getId());
        assertThat(aluno1).isEqualTo(aluno2);

        aluno2 = getAlunoSample2();
        assertThat(aluno1).isNotEqualTo(aluno2);
    }

    @Test
    void metaTest() {
        Aluno aluno = getAlunoRandomSampleGenerator();
        Meta metaBack = getMetaRandomSampleGenerator();

        aluno.addMeta(metaBack);
        assertThat(aluno.getMetas()).containsOnly(metaBack);
        assertThat(metaBack.getAluno()).isEqualTo(aluno);

        aluno.removeMeta(metaBack);
        assertThat(aluno.getMetas()).doesNotContain(metaBack);
        assertThat(metaBack.getAluno()).isNull();

        aluno.metas(new HashSet<>(Set.of(metaBack)));
        assertThat(aluno.getMetas()).containsOnly(metaBack);
        assertThat(metaBack.getAluno()).isEqualTo(aluno);

        aluno.setMetas(new HashSet<>());
        assertThat(aluno.getMetas()).doesNotContain(metaBack);
        assertThat(metaBack.getAluno()).isNull();
    }

    @Test
    void notaTest() {
        Aluno aluno = getAlunoRandomSampleGenerator();
        Nota notaBack = getNotaRandomSampleGenerator();

        aluno.addNota(notaBack);
        assertThat(aluno.getNotas()).containsOnly(notaBack);
        assertThat(notaBack.getAluno()).isEqualTo(aluno);

        aluno.removeNota(notaBack);
        assertThat(aluno.getNotas()).doesNotContain(notaBack);
        assertThat(notaBack.getAluno()).isNull();

        aluno.notas(new HashSet<>(Set.of(notaBack)));
        assertThat(aluno.getNotas()).containsOnly(notaBack);
        assertThat(notaBack.getAluno()).isEqualTo(aluno);

        aluno.setNotas(new HashSet<>());
        assertThat(aluno.getNotas()).doesNotContain(notaBack);
        assertThat(notaBack.getAluno()).isNull();
    }
}
