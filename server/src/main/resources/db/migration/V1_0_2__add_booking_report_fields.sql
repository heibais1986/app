-- +----------------------------------------------------------------------
-- | 友得云客  - 开启房产营销新纪元
-- +----------------------------------------------------------------------
-- | Copyright (c) 2019~2023 优得（西安）信息科技有限公司版权所有
-- +----------------------------------------------------------------------
-- | Licensed 友得云客不是自有软件 未经允许不可移除相关版权
-- +----------------------------------------------------------------------
-- | Author: www.youdeyunke.com
-- +----------------------------------------------------------------------

-- 报备功能：为 booking_logs 表新增字段
ALTER TABLE booking_logs
ADD COLUMN broker_name VARCHAR(50) NULL COMMENT '带看经纪人姓名' AFTER mobile,
ADD COLUMN broker_mobile VARCHAR(20) NULL COMMENT '带看经纪人电话' AFTER broker_name,
ADD COLUMN channel_user_id INT NULL COMMENT '渠道人员ID' AFTER broker_mobile,
ADD COLUMN post_ids TEXT NULL COMMENT '意向楼盘ID列表，逗号分隔' AFTER channel_user_id,
ADD COLUMN note TEXT NULL COMMENT '备注' AFTER post_ids;

-- 添加外键约束（可选，根据业务需求决定）
-- ALTER TABLE booking_logs
-- ADD CONSTRAINT fk_booking_logs_channel_user
-- FOREIGN KEY (channel_user_id) REFERENCES users(id);
