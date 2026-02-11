package com.udeve.repository;

import com.udeve.entity.PostPdf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostPdfRepository extends JpaRepository<PostPdf, Integer> {
    List<PostPdf> findByPostIdOrderBySortAsc(Integer postId);
    void deleteByPostId(Integer postId);
}
