<!--
+----------------------------------------------------------------------
| 友得云客  - 开启房产营销新纪元
+----------------------------------------------------------------------
| Copyright (c) 2019~2023 优得（西安）信息科技有限公司版权所有
+----------------------------------------------------------------------
| Licensed 友得云客不是自由软件 未经允许不可移除相关版权
+----------------------------------------------------------------------
| Author: www.youdeyunke.com
+----------------------------------------------------------------------
-->
<template>
    <div class="post-pdf-manager">
        <div class="pdf-list" v-if="pdfs.length > 0">
            <div class="pdf-item" v-for="(pdf, index) in pdfs" :key="pdf.id">
                <div class="pdf-info">
                    <i class="el-icon-document"></i>
                    <span class="pdf-name">{{ pdf.name }}</span>
                    <span class="pdf-size" v-if="pdf.size">({{ formatFileSize(pdf.size) }})</span>
                </div>
                <div class="pdf-actions">
                    <el-button type="text" size="mini" @click="viewPdf(pdf.url)">查看</el-button>
                    <el-button type="text" size="mini" @click="editPdf(pdf)">编辑</el-button>
                    <el-button type="text" size="mini" style="color: #f56c6c" @click="deletePdf(pdf.id)">删除</el-button>
                </div>
            </div>
        </div>
        <div class="empty" v-else>
            <i class="el-icon-document"></i>
            <span>暂无PDF文件</span>
        </div>
        
        <div class="upload-area">
            <el-upload
                ref="upload"
                action="/api/v6/upload"
                :headers="headers"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :on-error="handleError"
                :show-file-list="false"
                accept=".pdf"
                :limit="10"
                :multiple="true"
            >
                <el-button type="primary" size="small" icon="el-icon-upload">
                    上传PDF文件
                </el-button>
            </el-upload>
            <span class="upload-tip">支持PDF格式，单个文件不超过50MB</span>
        </div>

        <!-- 编辑PDF名称对话框 -->
        <el-dialog title="编辑PDF名称" :visible.sync="editDialogVisible" width="400px">
            <el-form :model="editForm" label-width="80px">
                <el-form-item label="文件名称">
                    <el-input v-model="editForm.name" placeholder="请输入PDF文件名称"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveEdit">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getPostPdfs, addPostPdf, updatePostPdf, deletePostPdf } from '@/api/postPdf';
import { mapGetters } from 'vuex';

export default {
    name: 'PostPdfManager',
    props: {
        postId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            pdfs: [],
            loading: false,
            editDialogVisible: false,
            editForm: {
                id: null,
                name: ''
            }
        };
    },
    computed: {
        ...mapGetters(['token']),
        headers() {
            return {
                Authorization: `Bearer ${this.token}`
            };
        }
    },
    watch: {
        postId: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.loadPdfs();
                }
            }
        }
    },
    methods: {
        loadPdfs() {
            this.loading = true;
            getPostPdfs(this.postId).then(res => {
                if (res.status === 0) {
                    this.pdfs = res.data || [];
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },

        formatFileSize(size) {
            if (!size) return '';
            if (size < 1024) {
                return size + ' B';
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(1) + ' KB';
            } else {
                return (size / (1024 * 1024)).toFixed(1) + ' MB';
            }
        },

        beforeUpload(file) {
            const isPdf = file.type === 'application/pdf';
            if (!isPdf) {
                this.$message.error('只能上传PDF文件!');
                return false;
            }
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                this.$message.error('文件大小不能超过 50MB!');
                return false;
            }
            return true;
        },

        handleSuccess(response, file) {
            if (response.code === 0 || response.status === 0) {
                const data = response.data;
                addPostPdf({
                    post_id: this.postId,
                    name: file.name.replace('.pdf', ''),
                    url: data.url,
                    size: data.size
                }).then(res => {
                    if (res.status === 0) {
                        this.$message.success('上传成功');
                        this.loadPdfs();
                    } else {
                        this.$message.error(res.message || '添加失败');
                    }
                });
            } else {
                this.$message.error(response.message || '上传失败');
            }
        },

        handleError() {
            this.$message.error('上传失败');
        },

        viewPdf(url) {
            window.open(url, '_blank');
        },

        editPdf(pdf) {
            this.editForm = {
                id: pdf.id,
                name: pdf.name
            };
            this.editDialogVisible = true;
        },

        saveEdit() {
            if (!this.editForm.name.trim()) {
                this.$message.error('请输入文件名称');
                return;
            }
            updatePostPdf(this.editForm.id, {
                name: this.editForm.name
            }).then(res => {
                if (res.status === 0) {
                    this.$message.success('更新成功');
                    this.editDialogVisible = false;
                    this.loadPdfs();
                } else {
                    this.$message.error(res.message || '更新失败');
                }
            });
        },

        deletePdf(id) {
            this.$confirm('确定要删除这个PDF文件吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deletePostPdf(id).then(res => {
                    if (res.status === 0) {
                        this.$message.success('删除成功');
                        this.loadPdfs();
                    } else {
                        this.$message.error(res.message || '删除失败');
                    }
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.post-pdf-manager {
    padding: 20px;
}

.pdf-list {
    margin-bottom: 20px;
}

.pdf-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: #f5f7fa;
}

.pdf-info {
    display: flex;
    align-items: center;
    flex: 1;
    
    i {
        font-size: 24px;
        color: #ff4d4f;
        margin-right: 10px;
    }
    
    .pdf-name {
        font-size: 14px;
        color: #303133;
        margin-right: 10px;
    }
    
    .pdf-size {
        font-size: 12px;
        color: #909399;
    }
}

.pdf-actions {
    display: flex;
    gap: 10px;
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #909399;
    
    i {
        font-size: 48px;
        margin-bottom: 10px;
    }
}

.upload-area {
    display: flex;
    align-items: center;
    gap: 15px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
}

.upload-tip {
    font-size: 12px;
    color: #909399;
}
</style>
