import type { ContactInfo } from "@/types/content";

export const contactInfo: ContactInfo = {
  companyName: "青岛世天创新航空科技有限公司",
  companyNameEn: "Qingdao Shitian Innovation Aviation Technology Co., Ltd.",
  contactPerson: "林总",
  contactPersonEn: "Mr. Lin",
  phone: "185 8865 6742",
  telephone: "0532-8872 7118",
  email: "sales@shitianuav.com",
  website: "www.shitianuav.com",
  addresses: [
    {
      value: "青岛市城阳区祥阳路 106 号 5 号楼首层",
      valueEn: "Ground floor, Building 5, 106 Xiangyang Road, Chengyang District, Qingdao",
      status: "approved"
    }
  ],
  social: [
    {
      name: "世天航空公众号",
      nameEn: "Shitian Aviation · WeChat",
      mediaId: "qr-wechat",
      status: "local"
    },
    {
      name: "世天航空抖音号",
      nameEn: "Shitian Aviation · Douyin",
      mediaId: "qr-douyin",
      status: "local"
    }
  ]
};
