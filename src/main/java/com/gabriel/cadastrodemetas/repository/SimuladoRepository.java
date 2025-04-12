package com.gabriel.cadastrodemetas.repository;

import com.gabriel.cadastrodemetas.domain.Simulado;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Simulado entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SimuladoRepository extends JpaRepository<Simulado, Long> {}
