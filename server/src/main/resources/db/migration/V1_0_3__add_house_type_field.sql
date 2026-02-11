-- +----------------------------------------------------------------------
-- | 友得云客  - 开启房产营销新纪元
-- +----------------------------------------------------------------------
-- | Copyright (c) 2019~2023 优得（西安）信息科技有限公司版权所有
-- +----------------------------------------------------------------------
-- | Licensed 友得云客不是自有软件 未经允许不可移除相关版权
-- +----------------------------------------------------------------------
-- | Author: www.youdeyunke.com
-- +----------------------------------------------------------------------

-- 房源类型功能：为新房表添加房源类型字段
ALTER TABLE posts
ADD COLUMN house_type TINYINT DEFAULT 0 COMMENT '房源类型：0-普通房源，1-工抵房源，2-代卖房源' AFTER remark;

-- 为二手房表添加房源类型字段
ALTER TABLE houses
ADD COLUMN house_type TINYINT DEFAULT 0 COMMENT '房源类型：0-普通房源，1-工抵房源，2-代卖房源';

-- 创建索引以提高筛选性能
CREATE INDEX idx_posts_house_type ON posts(house_type);
CREATE INDEX idx_houses_house_type ON houses(house_type);
