const fs = require("fs");
const path = require("path");

const CONFIG_OUTPUT_FILENAME = "Insert_Script";
const CONFIG_MAPPING_FILENAME = "Schema";
const CONFIG_FILENAME_PATH = path.join(
  __dirname,
  "CONFIGS",
  `${CONFIG_MAPPING_FILENAME}.config.json`
);
const CONFIG_INPUT_PATH = path.join(__dirname, "DATA", "DATA.json");
const CONFIG_OUTPUT_DIR = path.join(__dirname, "Output");
const CONFIG_OUTPUT_PATH = path.join(
  CONFIG_OUTPUT_DIR,
  `${CONFIG_OUTPUT_FILENAME}.sql`
);

function FUNCTION_ESC_SQL(str) {
  return typeof str === "string" ? str.replace(/'/g, "''") : str;
}

function FUNCTION_FORMAT_SQL(input) {
  let SLUG_VALUE = input;
  let CONFIG_RAW = false;

  if (typeof input === "object" && input !== null && "value" in input) {
    SLUG_VALUE = input.value;
    CONFIG_RAW = input.raw;
  }

  if (SLUG_VALUE === null || SLUG_VALUE === undefined) return "NULL";
  if (typeof SLUG_VALUE === "number") return SLUG_VALUE;
  if (CONFIG_RAW) return SLUG_VALUE;

  return `'${FUNCTION_ESC_SQL(SLUG_VALUE)}'`;
}

function GENERATE_SQL_INSERT(data, table, mapping) {
  const columns = Object.keys(mapping);

  return data
    .map((row) => {
      const values = columns.map((col) => {
        const source = mapping[col];

        if (typeof source === "function") {
          return FUNCTION_FORMAT_SQL(source(row));
        } else if (typeof source === "string") {
          return FUNCTION_FORMAT_SQL(row[source]);
        } else if (typeof source === "object" && "value" in source) {
          return FUNCTION_FORMAT_SQL(source);
        } else {
          return "NULL";
        }
      });

      return `INSERT INTO ${table} (${columns.join(
        ", "
      )}) VALUES (${values.join(", ")});`;
    })
    .join("\n");
}

// MAIN
const CONFIG_FILE = JSON.parse(fs.readFileSync(CONFIG_FILENAME_PATH, "utf8"));
const CONFIG_JSON_DATA = JSON.parse(fs.readFileSync(CONFIG_INPUT_PATH, "utf8"));

const STRING_TABLE_NAME = CONFIG_FILE.table;
const CONFIG_SCHEMA_MAPPING = CONFIG_FILE.mapping;

const RESULT_SCRIPT = GENERATE_SQL_INSERT(
  CONFIG_JSON_DATA,
  STRING_TABLE_NAME,
  CONFIG_SCHEMA_MAPPING
);

if (!fs.existsSync(CONFIG_OUTPUT_DIR)) fs.mkdirSync(CONFIG_OUTPUT_DIR);
fs.writeFileSync(CONFIG_OUTPUT_PATH, RESULT_SCRIPT, "utf8");

console.log(`✅ SQL script generated: ${CONFIG_OUTPUT_PATH}`);
