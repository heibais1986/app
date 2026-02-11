package com.udeve.controllers.admin;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.annotation.SaCheckRole;
import cn.dev33.satoken.annotation.SaMode;
import com.udeve.BaseApiController;
import com.udeve.service.PostPdfService;
import com.udeve.utils.JsonResponse;
import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@SaCheckLogin
@Api(tags = "楼盘PDF管理")
@SaCheckRole(value = {"admin","demo"},mode = SaMode.OR)
@RequestMapping("/admin6")
public class AdminPostPdfController extends BaseApiController {

    @Autowired
    private PostPdfService postPdfService;

    @Operation(summary = "获取楼盘PDF列表", description = "根据楼盘ID获取关联的PDF文件列表")
    @GetMapping(value = "/post_pdfs")
    public JsonResponse getPdfsByPostId(@RequestParam("post_id") Integer postId) {
        return postPdfService.getPdfsByPostId(postId);
    }

    @Operation(summary = "添加楼盘PDF", description = "为楼盘添加PDF文件")
    @PostMapping(value = "/post_pdfs")
    public JsonResponse addPdf(
            @RequestParam("post_id") Integer postId,
            @RequestParam("name") String name,
            @RequestParam("url") String url,
            @RequestParam(value = "size", required = false) Integer size) {
        return postPdfService.addPdf(postId, name, url, size);
    }

    @Operation(summary = "更新楼盘PDF", description = "更新PDF文件信息")
    @PutMapping(value = "/post_pdfs/{id}")
    public JsonResponse updatePdf(
            @PathVariable("id") Integer id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "sort", required = false) Integer sort) {
        return postPdfService.updatePdf(id, name, sort);
    }

    @Operation(summary = "删除楼盘PDF", description = "删除指定的PDF文件")
    @DeleteMapping(value = "/post_pdfs/{id}")
    public JsonResponse deletePdf(@PathVariable("id") Integer id) {
        return postPdfService.deletePdf(id);
    }

    @Operation(summary = "批量删除楼盘PDF", description = "根据楼盘ID删除所有关联的PDF文件")
    @DeleteMapping(value = "/post_pdfs")
    public JsonResponse deletePdfsByPostId(@RequestParam("post_id") Integer postId) {
        return postPdfService.deletePdfsByPostId(postId);
    }
}
