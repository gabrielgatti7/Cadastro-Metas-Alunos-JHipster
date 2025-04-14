package com.gabriel.cadastrodemetas.repository;

import com.gabriel.cadastrodemetas.domain.Aluno;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Aluno entity.
 */
@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    default Optional<Aluno> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Aluno> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Aluno> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select aluno from Aluno aluno left join fetch aluno.user", countQuery = "select count(aluno) from Aluno aluno")
    Page<Aluno> findAllWithToOneRelationships(Pageable pageable);

    @Query("select aluno from Aluno aluno left join fetch aluno.user")
    List<Aluno> findAllWithToOneRelationships();

    @Query("select aluno from Aluno aluno left join fetch aluno.user where aluno.id =:id")
    Optional<Aluno> findOneWithToOneRelationships(@Param("id") Long id);
}
