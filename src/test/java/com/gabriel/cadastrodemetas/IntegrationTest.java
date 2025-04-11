package com.gabriel.cadastrodemetas;

import com.gabriel.cadastrodemetas.config.AsyncSyncConfiguration;
import com.gabriel.cadastrodemetas.config.EmbeddedSQL;
import com.gabriel.cadastrodemetas.config.JacksonConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { CadastrodemetasApp.class, JacksonConfiguration.class, AsyncSyncConfiguration.class })
@EmbeddedSQL
public @interface IntegrationTest {
}
