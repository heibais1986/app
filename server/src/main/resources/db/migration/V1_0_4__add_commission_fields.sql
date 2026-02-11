-- +----------------------------------------------------------------------
-- | 友得云客  - 开启房产营销新纪元
-- +----------------------------------------------------------------------
-- | Copyright (c) 2019~2023 优得（西安）信息科技有限公司版权所有
-- +----------------------------------------------------------------------
-- | Licensed 友得云客不是自有软件 未经允许不可移除相关版权
-- +----------------------------------------------------------------------
-- | Author: www.youdeyunke.com
-- +----------------------------------------------------------------------

-- 佣金功能：为新房表添加佣金字段
ALTER TABLE posts
ADD COLUMN commission_amount DECIMAL(10,2) NULL COMMENT '推广佣金金额（元）' AFTER house_type,
ADD COLUMN commission_rate DECIMAL(5,2) NULL COMMENT '推广佣金比例（%）' AFTER commission_amount;

-- 为二手房表添加佣金字段
ALTER TABLE houses
ADD COLUMN commission_amount DECIMAL(10,2) NULL COMMENT '推广佣金金额（元）' AFTER house_type,
ADD COLUMN commission_rate DECIMAL(5,2) NULL COMMENT '推广佣金比例（%）' AFTER commission_amount;

-- 创建索引以提高查询性能
CREATE INDEX idx_posts_commission ON posts(commission_amount);
CREATE INDEX idx_houses_commission ON houses(commission_amount);
