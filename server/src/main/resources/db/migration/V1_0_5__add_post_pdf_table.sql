-- +----------------------------------------------------------------------
-- | 友得云客  - 开启房产营销新纪元
-- +----------------------------------------------------------------------
-- | Copyright (c) 2019~2023 优得（西安）信息科技有限公司版权所有
-- +----------------------------------------------------------------------
-- | Licensed 友得云客不是自有软件 未经允许不可移除相关版权
-- +----------------------------------------------------------------------
-- | Author: www.youdeyunke.com
-- +----------------------------------------------------------------------

-- 楼盘PDF文件管理表
CREATE TABLE post_pdfs (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    post_id INT NOT NULL COMMENT '关联楼盘ID',
    name VARCHAR(255) NOT NULL COMMENT 'PDF文件名称',
    url VARCHAR(500) NOT NULL COMMENT 'PDF文件URL',
    size INT DEFAULT 0 COMMENT '文件大小（字节）',
    sort INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_post_id (post_id),
    INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='楼盘PDF文件表';
