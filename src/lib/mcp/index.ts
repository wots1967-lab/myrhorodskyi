import { defineMcp } from "@lovable.dev/mcp-js";
import listTests from "./tools/list-tests";
import getTestResult from "./tools/get-test-result";
import practitionerInfo from "./tools/practitioner-info";

export default defineMcp({
  name: "myrhorodskyi-mcp",
  title: "Myrhorodskyi Psychology MCP",
  version: "0.1.0",
  instructions:
    "Публічний MCP-сервер сайту myrhorodskyi.com (психолог Сергій Миргородський). " +
    "Використовуй `list_tests`, щоб отримати каталог доступних психологічних тестів; " +
    "`get_test_result`, щоб прочитати збережений результат тесту за slug зі сторінки результату; " +
    "`practitioner_info`, щоб отримати інформацію про підхід і контакти для запису на сесію.",
  tools: [listTests, getTestResult, practitionerInfo],
});