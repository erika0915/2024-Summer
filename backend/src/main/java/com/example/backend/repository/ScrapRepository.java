package com.example.backend.repository;

import com.example.backend.entity.Scrap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScrapRepository extends JpaRepository<Scrap, Long>{
    @Query(value="select * from scraps where user_code=:user_code", nativeQuery = true)
    List<Scrap> ScrapByUserCode(Long user_code);
}