import express, { RequestHandler, Request, Response } from 'express'
import OpenAI from 'openai'
import {
    accessBankRegex,
    fidelityBankRegex,
    gtBankRegex,
    ubaBankRegex,
} from '../parsers';

const regexMap: { [key: string]: RegExp } = {
    AccessBank: accessBankRegex,
    FidelityBank: fidelityBankRegex,
    GTB: gtBankRegex,
    UBA: ubaBankRegex,
};

const debitFlags = ['dr', 'debit']
const creditFlags = ['cr', 'credit']

const formatDate = (date: string) => {
    let d_date
    if (date.includes('AM')){
        date = date.replace('AM', '')
        d_date = new Date(date)
        let formattedHour: number = d_date.getHours();
        d_date.setHours(formattedHour+1)
    }
    else if (date.includes('PM')){
        date = date.replace('PM', '')
        d_date = new Date(date)
        let formattedHour: number = d_date.getHours();
        formattedHour == 12 ? '' : formattedHour += 12;
        d_date.setHours(formattedHour+1)
    }
    else{
        d_date = new Date(date)
        d_date.setHours(d_date.getHours()+1)
    }
    return d_date.toISOString().replace('T', ' ').replace(/\.(\S+)/g, '')
}

const parseSMS = (regex: RegExp, message: string) => {
    const match = message.match(regex);

    if (!match?.groups) {
        throw new Error("Message format not recognized.");
    }

    let res = {
        institution: match.groups?.institution || "",
        amount: parseFloat(match.groups?.amount || "0"),
        balance: parseFloat(match.groups?.balance || "0"),
        currency: match.groups?.currency || "Naira",
        narration: match.groups?.narration || "",
        transaction_time: match.groups?.transaction_time || "",
        debit_credit: match.groups?.debit_credit?.toLowerCase() || "unknown",
    };

    debitFlags.includes(res.debit_credit)  ? res.debit_credit = 'debit' : ''
    creditFlags.includes(res.debit_credit) ? res.debit_credit = 'credit' : ''

    res.transaction_time = formatDate(res.transaction_time)

    return res;
};

const stripCommas = (value: string): string => value.replace(/,/g, '');


export const parse_message: RequestHandler = async (req: Request, res: Response) => {
    const { parser, message, sender_id } = req.body;

    const new_message = stripCommas(message)

    const regex: any = regexMap[sender_id];
    if (!regex) {
        return res.status(400).json({ error: 'Unsupported sender ID, supported sender Ids are AccessBank, FidelityBank, GTB and UBA' });
    }

    try {
        const parsedData = parseSMS(regex, new_message);
        parsedData.institution = sender_id.length > 4 ? sender_id.replace(/([A-Z])/g, ' $1').trim() : sender_id        
        res.status(200).json(parsedData);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}