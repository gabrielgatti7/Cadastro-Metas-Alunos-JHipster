package com.gabriel.cadastrodemetas.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class NotaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Nota getNotaSample1() {
        return new Nota().id(1L).valor(1);
    }

    public static Nota getNotaSample2() {
        return new Nota().id(2L).valor(2);
    }

    public static Nota getNotaRandomSampleGenerator() {
        return new Nota().id(longCount.incrementAndGet()).valor(intCount.incrementAndGet());
    }
}
