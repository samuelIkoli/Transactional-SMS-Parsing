"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __glob = (map) => (path) => {
  var fn = map[path];
  if (fn) return fn();
  throw new Error("Module not found in bundle: " + path);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/parsers.ts
var accessBankRegex, fidelityBankRegex, ubaBankRegex, gtBankRegex;
var init_parsers = __esm({
  "src/parsers.ts"() {
    "use strict";
    accessBankRegex = /(?<debit_credit>Debit|Credit)\nAmt:NGN(?<amount>[\d,]+\.\d{2})\nAcc:(?<account>[\d\*]+)\nDesc:(?<narration>[^\n]+)\nTime:(?<transaction_time>[\d\/: ]+)\nAvail Bal:NGN(?<balance>[\d,]+\.\d{2})/i;
    fidelityBankRegex = /Acct:\*\*(?<account>\d{4})\n(?<debit_credit>DR|CR):N(?<amount>[\d,]+(?:\.\d+)?)[\s\S]*?Desc:(?<narration>[\s\S]+?)(?:\n|\s+)DT:(?<transaction_time>\d{2}\/[A-Z]{3}\/\d{2} [\d:AMP]+)[\s\S]*?Bal:N(?<balance>[\d,]+(?:\.\d+)?)/i;
    ubaBankRegex = /Txn: (?<debit_credit>Debit|Credit)\nAc:(?<account>[^\n]+)\nAmt:NGN (?<amount>[\d,]+(?:\.\d{2})?)\nDes:(?<narration>[^\n]+)\nDate:(?<transaction_time>\d{2}-[A-Za-z]{3}-\d{4} [\d:]+)\nBal:NGN (?<balance>[\d,]+(?:\.\d{2})?)/i;
    gtBankRegex = /Acct: \*\*\*\*\*\*(?<account>\d{4})\nAmt: NGN(?<amount>[\d,]+(?:\.\d+)?)[\s\S]+?(?<debit_credit>CR|DR)[\s\S]*?Desc: (?<narration>[^\n]+)\nAvail Bal: NGN(?<balance>[\d,]+(?:\.\d+)?)[\s\S]*?Date: (?<transaction_time>\d{2}-[A-Za-z]{3}-\d{4} [\d:]+)/i;
  }
});

// src/controllers/parse.ts
var regexMap, debitFlags, creditFlags, formatDate, parseSMS, stripCommas, parse_message;
var init_parse = __esm({
  "src/controllers/parse.ts"() {
    "use strict";
    init_parsers();
    regexMap = {
      AccessBank: accessBankRegex,
      FidelityBank: fidelityBankRegex,
      GTB: gtBankRegex,
      UBA: ubaBankRegex
    };
    debitFlags = ["dr", "debit"];
    creditFlags = ["cr", "credit"];
    formatDate = (date) => {
      let d_date;
      if (date.includes("AM")) {
        date = date.replace("AM", "");
        d_date = new Date(date);
        let formattedHour = d_date.getHours();
        d_date.setHours(formattedHour + 1);
      } else if (date.includes("PM")) {
        date = date.replace("PM", "");
        d_date = new Date(date);
        let formattedHour = d_date.getHours();
        formattedHour == 12 ? "" : formattedHour += 12;
        d_date.setHours(formattedHour + 1);
      } else {
        d_date = new Date(date);
        d_date.setHours(d_date.getHours() + 1);
      }
      return d_date.toISOString().replace("T", " ").replace(/\.(\S+)/g, "");
    };
    parseSMS = (regex, message) => {
      const match = message.match(regex);
      if (!match?.groups) {
        throw new Error("Message format not recognized.");
      }
      return {
        institution: match.groups?.institution || "",
        amount: parseFloat(match.groups?.amount || "0"),
        balance: parseFloat(match.groups?.balance || "0"),
        currency: match.groups?.currency || "Naira",
        narration: match.groups?.narration || "",
        transaction_time: match.groups?.transaction_time || "",
        debit_credit: match.groups?.debit_credit?.toLowerCase() || "unknown"
      };
    };
    stripCommas = (value) => value.replace(/,/g, "");
    parse_message = async (req, res) => {
      const { parser, message, sender_id } = req.body;
      const new_message = stripCommas(message);
      const regex = regexMap[sender_id];
      if (!regex) {
        return res.status(400).json({ error: "Unsupported sender ID, supported sender Ids are AccessBank, FidelityBank, GTB and UBA" });
      }
      try {
        const parsedData = parseSMS(regex, new_message);
        parsedData.institution = sender_id.length > 4 ? sender_id.replace(/([A-Z])/g, " $1").trim() : sender_id;
        console.log(parsedData.debit_credit, "hay");
        debitFlags.includes(parsedData.debit_credit) ? parsedData.debit_credit = "debit" : "";
        creditFlags.includes(parsedData.debit_credit) ? parsedData.debit_credit = "credit" : "";
        parsedData.transaction_time = formatDate(parsedData.transaction_time);
        res.status(200).json(parsedData);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
  }
});

// src/routes/parse.ts
var require_parse = __commonJS({
  "src/routes/parse.ts"(exports2, module2) {
    "use strict";
    var import_express2 = __toESM(require("express"));
    init_parse();
    var router = import_express2.default.Router();
    router.post("/parse", parse_message);
    module2.exports = router;
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_express = __toESM(require("express"));
var import_fs = require("fs");

// require("./routes/**/*") in src/index.ts
var globRequire_routes = __glob({
  "./routes/parse.ts": () => require_parse()
});

// src/index.ts
var app = (0, import_express.default)();
var port = process.env.PORT || 3e3;
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello, world! I am an SMS parser and I was born on 24-05-2024 and deployed on 26-04-2024");
});
app.get("/try", (req, res) => {
  res.send("Hello, world! The thing go skkkkrrrr pa!!!!");
});
(0, import_fs.readdirSync)("./src/routes").map(
  (path) => app.use("/", globRequire_routes(`./routes/${path}`))
);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
var src_default = app;
