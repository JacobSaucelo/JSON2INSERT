# Json2Insert

Converts JSON data into SQL `INSERT` statements using a simple schema config. Built with Node.js.

## 📁 Folder Structure

```

Json2Insert/
├── CONFIGS/
│ └── Schema.config.json # Define your SQL table and column mapping here
├── DATA/
│ └── DATA.json # Drop your raw JSON data here
├── Output/
│ └── Insert_Script.sql # This is where the generated SQL script will be saved

```

## 🛠️ How It Works

1. Define your table and column mapping in `CONFIGS/Schema.config.json`.
2. Place your raw JSON in `DATA/DATA.json`.
3. Run the script `npm run start`.
4. SQL `INSERT` statements are generated in `Output/Insert_Script.sql`.

---

## ⚙️ Schema Configuration

**Example:** `CONFIGS/Schema.config.json`

```json
{
  "table": "[YourDatabase].[dbo].[YourTable]",
  "mapping": {
    "Mfr": "MFR",
    "Model": "MODEL",
    "DateCreated": { "value": "GETDATE()", "raw": true },
    "CreatedBy": { "value": "JSaucelo", "raw": false },
    "DateModified": { "value": "GETDATE()", "raw": true },
    "ModifiedBy": { "value": "JSaucelo", "raw": false }
  }
}
```

### 🔹 `mapping` Key Types

- `"Mfr": "MFR"` — Maps the `MFR` field in your JSON to the SQL column `Mfr`.
- `"value"` — A static value to insert.
- `"raw": true` — Insert the value as-is (no quotes), e.g. `GETDATE()`.
- `"raw": false` — Insert the value as a string (with quotes), e.g. `'JSaucelo'`.

---

## 🧾 Input JSON

Put your JSON array in `DATA/DATA.json`.

**Example:**

```json
[
  { "Mfr": "Sony", "Model": "X123" },
  { "Mfr": "Panasonic", "Model": "Z900" }
]
```

---

## ▶️ Run the Tool

Make sure dependencies are installed, then run:

```bash
node main.js
```

(Replace `main.js` if your entry file is named differently.)

---

## 📦 Output

The generated SQL script will be saved in:

```
Output/Insert_Script.sql
```

**Example output:**

```sql
INSERT INTO [YourDatabase].[dbo].[YourTable] (MFR, MODEL, DateCreated, CreatedBy, DateModified, ModifiedBy)
VALUES ('Sony', 'X123GETDATE(), 'JSaucelo', GETDATE(), 'JSaucelo');
```
