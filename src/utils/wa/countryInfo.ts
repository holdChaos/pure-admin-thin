/*
 * @Author: hechao “chao.he@genowis.com”
 * @LastEditTime: 2023-04-18 23时
 * @Description: 获取各个国家信息
 */

// 国家数据接口
interface ICountryInfo {
  /**国家中文名称 */
  "name_zh": string,
  /**国家英文名称 */
  "name_en": string,
  /**国家码 */
  "code": string,
  /**国家电话区号 */
  "areaCode": number,
  /**国家在sms-activate平台的国家码，该数据后续应当转入后端 */
  "smsactivateCode": number
}

// 批量 - 临时数据
export const countries: ICountryInfo[] = [
  { "name_zh":"印度","name_en":"India","code":"IN","areaCode":91,"smsactivateCode": 22 },
  { "name_zh": "塔吉克斯坦", "name_en": "Tajikstan", "code": "TJ",  "areaCode": 992, "smsactivateCode": 143 },
  { "name_zh":"俄罗斯","name_en":"Russian","code":"RU","areaCode":7,"smsactivateCode":0 },
  { "name_zh":"葡萄牙","name_en":"Portugal","code":"PT","areaCode":351,"smsactivateCode":117 },
  { "name_zh":"荷兰","name_en":"Netherlands","code":"NL","areaCode":31,"smsactivateCode":48 },
  { "name_zh":"瑞典","name_en":"Sweden","code":"SE","areaCode":46,"smsactivateCode":46 },
  { "name_zh":"德国","name_en":"Germany","code":"DE","areaCode":49,"smsactivateCode":43 },
  { "name_zh":"罗马尼亚","name_en":"Romania","code":"RO","areaCode":40,"smsactivateCode":32 },
  { "name_zh":"英格兰","name_en":"England","code":"UK","areaCode":44,"smsactivateCode":16 },
  { "name_zh":"法国","name_en":"France","code":"FR","areaCode":33,"smsactivateCode":78 },
  { "name_zh":"波兰","name_en":"Poland","code":"PL","areaCode":48,"smsactivateCode":15 },
  { "name_zh":"巴西","name_en":"Brazil","code":"BR","areaCode":55,"smsactivateCode":73 }
]

/**
 * 根据code获取对应国家数据
 * @param code 两位字母缩写
 */
export function getCountryByCode(code: string): ICountryInfo {
  let result = countries.filter(item => item.code === code);
  if (result.length > 0) return result[0]
}

export default countries;