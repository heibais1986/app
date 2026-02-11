package com.udeve.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 短信服务
 * 用于发送短信通知
 */
@Service
@Slf4j
public class SmsService {

    @Autowired
    private MyconfigService myconfigService;

    /**
     * 发送短信通知
     * @param mobile 接收手机号
     * @param templateCode 短信模板代码
     * @param params 模板参数
     * @return 是否发送成功
     */
    public boolean sendSms(String mobile, String templateCode, Map<String, String> params) {
        // TODO: 这里需要集成具体的短信服务商（阿里云、腾讯云等）
        // 目前先记录日志，实际项目中需要配置短信服务商的SDK
        log.info("发送短信通知到手机号：{}，模板：{}，参数：{}", mobile, templateCode, params);
        
        // 实际集成示例（阿里云短信）：
        // DefaultProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId, accessKeySecret);
        // IAcsClient client = new DefaultAcsClient(profile);
        // SendSmsRequest request = new SendSmsRequest();
        // request.setPhoneNumbers(mobile);
        // request.setSignName(signName);
        // request.setTemplateCode(templateCode);
        // request.setTemplateParam(JSONObject.toJSONString(params));
        // SendSmsResponse response = client.getAcsResponse(request);
        // return "OK".equals(response.getCode());
        
        // 临时返回true，实际项目中需要实现具体逻辑
        return true;
    }

    /**
     * 发送预约通知短信（简洁版）
     * @param mobile 接收手机号
     * @param clientName 客户姓名
     * @return 是否发送成功
     */
    public boolean sendBookingNotification(String mobile, String clientName) {
        Map<String, String> params = new HashMap<>();
        params.put("name", clientName);
        
        // 使用简洁的短信模板：您有新的预约信息，请登录小程序查看详情
        return sendSms(mobile, "BOOKING_NOTIFICATION", params);
    }

}
