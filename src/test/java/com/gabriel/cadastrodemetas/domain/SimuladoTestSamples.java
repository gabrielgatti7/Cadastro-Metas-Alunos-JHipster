package com.gabriel.cadastrodemetas.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SimuladoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Simulado getSimuladoSample1() {
        return new Simulado().id(1L).nome("nome1");
    }

    public static Simulado getSimuladoSample2() {
        return new Simulado().id(2L).nome("nome2");
    }

    public static Simulado getSimuladoRandomSampleGenerator() {
        return new Simulado().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
