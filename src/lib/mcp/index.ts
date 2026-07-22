import { defineMcp } from "@lovable.dev/mcp-js";
import listTests from "./tools/list-tests";
import practitionerInfo from "./tools/practitioner-info";

export default defineMcp({
  name: "myrhorodskyi-mcp",
  title: "Myrhorodskyi Psychology MCP",
  version: "0.1.0",
  instructions:
    "Публічний MCP-сервер сайту myrhorodskyi.com (психолог Сергій Миргородський). " +
    "Використовуй `list_tests`, щоб отримати каталог доступних психологічних тестів; " +
    "`practitioner_info`, щоб отримати інформацію про підхід і контакти для запису на сесію.",
  tools: [listTests, practitionerInfo],
});