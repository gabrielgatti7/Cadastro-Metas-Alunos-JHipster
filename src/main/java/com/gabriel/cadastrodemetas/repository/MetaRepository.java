package com.gabriel.cadastrodemetas.repository;

import com.gabriel.cadastrodemetas.domain.Meta;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Meta entity.
 */
@Repository
public interface MetaRepository extends JpaRepository<Meta, Long> {
    default Optional<Meta> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Meta> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Meta> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    List<Meta> findByAlunoId(Long alunoId);

    @Query(value = "select meta from Meta meta left join fetch meta.aluno", countQuery = "select count(meta) from Meta meta")
    Page<Meta> findAllWithToOneRelationships(Pageable pageable);

    @Query("select meta from Meta meta left join fetch meta.aluno")
    List<Meta> findAllWithToOneRelationships();

    @Query("select meta from Meta meta left join fetch meta.aluno where meta.id =:id")
    Optional<Meta> findOneWithToOneRelationships(@Param("id") Long id);
}
