package com.udeve.controllers.api;

import com.udeve.BaseApiController;
import com.udeve.service.PostPdfService;
import com.udeve.utils.JsonResponse;
import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags = "楼盘PDF接口")
public class PostPdfController extends BaseApiController {

    @Autowired
    private PostPdfService postPdfService;

    @Operation(summary = "获取楼盘PDF列表", description = "根据楼盘ID获取关联的PDF文件列表")
    @GetMapping(value = "/v6/post_pdfs/")
    public JsonResponse getPdfsByPostId(@RequestParam("post_id") Integer postId) {
        return postPdfService.getPdfsByPostId(postId);
    }
}
