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
    GTBank: gtBankRegex,
    UBA: ubaBankRegex,
};

const formatDate = (date: string) => {
    console.log(date, 'here')
    if (date.includes('AM')){
        date = date.replace('AM', '')
    }
    else if (date.includes('PM')){
        date = date.replace('PM', '')
    }
    else{
        var d_date = new Date(date)
    return d_date.toISOString().replace('T', ' ').replace(/\.(\S+)/g, '')
    }
    
}

const parseSMS = (regex: string, message: string) => {
    const match = message.match(new RegExp(regex));
    if (!regex){
        regex = "^[0-9]"
    }
    // if (!match) {
    //     throw new Error("Message format not recognized.");
    // }

    if (!match?.groups) {
        throw new Error("Message format not recognized.");
    }

    // Assuming the match groups correspond to the relevant data in order
    return {
        institution: match.groups?.institution || "",
        amount: parseFloat(match.groups?.amount || "0"),
        balance: parseFloat(match.groups?.balance || "0"),
        currency: match.groups?.currency || "Naira",
        narration: match.groups?.narration || "",
        transaction_time: match.groups?.transaction_time || "",
        debit_credit: match.groups?.debit_credit?.toLowerCase() || "unknown",
    };
};

const stripCommas = (value: string): string => value.replace(/,/g, '');


export const parse_message: RequestHandler = async (req: Request, res: Response) => {
    console.log('eba')
    const { parser, message, sender_id } = req.body;

    const new_message = stripCommas(message)

    const regex: any = regexMap[sender_id];
    if (!regex) {
        return res.status(400).json({ error: 'Unsupported sender ID' });
    }

    try {
        const parsedData = parseSMS(regex, new_message);
        parsedData.institution = sender_id.length > 4 ? sender_id.replace(/([A-Z])/g, ' $1').trim() : sender_id
        // console.log(parsedData.transaction_time)
        parsedData.transaction_time = formatDate(parsedData.transaction_time)
        res.json(parsedData);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}