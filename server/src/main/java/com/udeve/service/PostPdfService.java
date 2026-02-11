package com.udeve.service;

import com.udeve.entity.PostPdf;
import com.udeve.repository.PostPdfRepository;
import com.udeve.utils.JsonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostPdfService {

    @Autowired
    private PostPdfRepository postPdfRepository;

    public JsonResponse getPdfsByPostId(Integer postId) {
        List<PostPdf> pdfs = postPdfRepository.findByPostIdOrderBySortAsc(postId);
        return JsonResponse.ok(pdfs);
    }

    public JsonResponse addPdf(Integer postId, String name, String url, Integer size) {
        PostPdf pdf = new PostPdf();
        pdf.setPostId(postId);
        pdf.setName(name);
        pdf.setUrl(url);
        pdf.setSize(size);
        pdf.setCreatedAt(LocalDateTime.now());
        pdf.setUpdatedAt(LocalDateTime.now());
        pdf.setSort(0);
        
        PostPdf saved = postPdfRepository.save(pdf);
        return JsonResponse.ok(saved);
    }

    public JsonResponse updatePdf(Integer id, String name, Integer sort) {
        Optional<PostPdf> optional = postPdfRepository.findById(id);
        if (!optional.isPresent()) {
            return JsonResponse.error("PDF文件不存在");
        }
        
        PostPdf pdf = optional.get();
        if (name != null) {
            pdf.setName(name);
        }
        if (sort != null) {
            pdf.setSort(sort);
        }
        pdf.setUpdatedAt(LocalDateTime.now());
        
        PostPdf saved = postPdfRepository.save(pdf);
        return JsonResponse.ok(saved);
    }

    public JsonResponse deletePdf(Integer id) {
        Optional<PostPdf> optional = postPdfRepository.findById(id);
        if (!optional.isPresent()) {
            return JsonResponse.error("PDF文件不存在");
        }
        
        postPdfRepository.deleteById(id);
        return JsonResponse.ok("删除成功");
    }

    public JsonResponse deletePdfsByPostId(Integer postId) {
        postPdfRepository.deleteByPostId(postId);
        return JsonResponse.ok("删除成功");
    }
}
