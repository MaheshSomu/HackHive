package com.hackhive.team.repository;

import com.hackhive.team.entity.ExternalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExternalEventRepository extends JpaRepository<ExternalEvent, Long> {
}
