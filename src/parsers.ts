const accessBankRegex =
  /(?<debitCredit>Debit|Credit)\nAmt:(?<currency>[A-Z]+)(?<amount>[\d,]+\.\d{2})\nAcc:(?<account>[\d\*]+)\nDesc:(?<narration>[^\n]+)\nTime:(?<transactionTime>[\d\/: ]+)\nAvail Bal:(?<currency2>[A-Z]+)(?<balance>[\d,]+\.\d{2})/i;
const fidelityBankRegex =
  /Acct:\*\*(?<account>\d{4})\n(?<debitCredit>DR|CR):(?<currency>[A-Z]+)(?<amount>[\d,]+(?:\.\d+)?)[\s\S]*?Desc:(?<narration>[\s\S]+?)(?:\n|\s+)DT:(?<transactionTime>\d{2}\/[A-Z]{3}\/\d{2} [\d:AMP]+)[\s\S]*?Bal:N(?<balance>[\d,]+(?:\.\d+)?)/i;
const ubaBankRegex =
  /Txn: (?<debitCredit>Debit|Credit)\nAc:(?<account>[^\n]+)\nAmt:(?<currency>[A-Z]+) (?<amount>[\d,]+(?:\.\d{2})?)\nDes:(?<narration>[^\n]+)\nDate:(?<transactionTime>\d{2}-[A-Za-z]{3}-\d{4} [\d:]+)\nBal:NGN (?<balance>[\d,]+(?:\.\d{2})?)/i;
const gtBankRegex =
  /Acct: \*\*\*\*\*\*(?<account>\d{4})\nAmt: (?<currency>[A-Z]+)(?<amount>[\d,]+(?:\.\d+)?)[\s\S]+?(?<debitCredit>CR|DR)[\s\S]*?Desc: (?<narration>[^\n]+)\nAvail Bal: NGN(?<balance>[\d,]+(?:\.\d+)?)[\s\S]*?Date: (?<transactionTime>\d{2}-[A-Za-z]{3}-\d{4} [\d:]+)/i;

export { accessBankRegex, fidelityBankRegex, gtBankRegex, ubaBankRegex };
