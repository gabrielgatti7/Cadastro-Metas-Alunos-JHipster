package com.gabriel.cadastrodemetas.web.rest.errors;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import tech.jhipster.web.util.HeaderUtil;

@ControllerAdvice
@Order(1)
public class CustomExceptionTranslator {

    private final Logger log = LoggerFactory.getLogger(CustomExceptionTranslator.class);

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ProblemDetail> handleDataIntegrityViolationException(
        DataIntegrityViolationException ex,
        HttpServletRequest request
    ) {
        if (ex.getMessage() != null && ex.getMessage().contains("uq_meta_aluno_area")) {
            log.warn("Attempt to insert duplicate meta detected: {}", ex.getMessage());
            BadRequestAlertException customException = new BadRequestAlertException(
                "There is already a meta registered for this area and student.",
                "meta",
                "duplicated"
            );
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert("meta", false, "meta", "duplicated", customException.getMessage()))
                .body(null);
        }

        return null;
    }
}
