package com.udeve.request;
/**
 * +----------------------------------------------------------------------
 * | 友得云客  - 开启房产营销新纪元
 * +----------------------------------------------------------------------
 * | Copyright (c) 2019~2023 优得（西安）信息科技有限公司版权所有
 * +----------------------------------------------------------------------
 * | Licensed 友得云客不是自有软件 未经允许不可移除相关版权
 * +----------------------------------------------------------------------
 * | Author: www.youdeyunke.com
 * +----------------------------------------------------------------------
 */
import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

@Data
public class BookingLogsRequest implements Serializable {

    @NotNull(message = "楼盘id不能为空")
    public Integer postId;
    public Integer userId;
    public String remark;
    public Integer status;
    public LocalDate date;
    public String time;
    public String name;
    @NotBlank(message = "手机号不能为空")
    public String mobile;

    // 性别：0-保密，1-男，2-女
    public Integer gender = 0;

    // 报备功能新增字段
    public String brokerName;      // 带看经纪人姓名
    public String brokerMobile;    // 带看经纪人电话
    public Integer channelUserId;  // 渠道人员ID
    public String postIds;         // 意向楼盘ID列表，逗号分隔
    public String note;            // 备注

}
