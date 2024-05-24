const accessBankRegex = /(?<debit_credit>Debit|Credit)\nAmt:NGN(?<amount>[\d,]+\.\d{2})\nAcc:(?<account>[\d\*]+)\nDesc:(?<narration>[^\n]+)\nTime:(?<transaction_time>[\d\/: ]+)\nAvail Bal:NGN(?<balance>[\d,]+\.\d{2})/i;
const fidelityBankRegex = /Acct:\*\*(?<account>\d{4})\n(?<debit_credit>DR|CR):N(?<amount>[\d,]+(?:\.\d+)?)[\s\S]*?Desc:(?<narration>[\s\S]+?)(?:\n|\s+)DT:(?<transaction_time>\d{2}\/[A-Z]{3}\/\d{2} [\d:AMP]+)[\s\S]*?Bal:N(?<balance>[\d,]+(?:\.\d+)?)/i;
const gtBankRegex = /Acct: \*\*\*\*\*\*(?<account>\d{4}) \nAmt: NGN(?<amount>[\d,]+\.\d{2}) (?<debit_credit>CR|DR)\s*Desc: (?<narration>[^\n]+)\s*Avail Bal: NGN(?<balance>[\d,]+\.\d{2})\s*Date: (?<transaction_time>[\d-]+ [\d:]+)/i;
const ubaBankRegex = /Txn: (?<debit_credit>Debit|Credit)\nAc:(?<account>[^\n]+)\nAmt:NGN (?<amount>[\d,]+(?:\.\d{2})?)\nDes:(?<narration>[^\n]+)\nDate:(?<transaction_time>\d{2}-[A-Za-z]{3}-\d{4} [\d:]+)\nBal:NGN (?<balance>[\d,]+(?:\.\d{2})?)/i;

export {
    accessBankRegex,
    fidelityBankRegex,
    gtBankRegex,
    ubaBankRegex,
};
