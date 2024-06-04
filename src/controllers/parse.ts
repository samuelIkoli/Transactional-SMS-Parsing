import express, { RequestHandler, Request, Response } from "express";
import OpenAI from "openai";
import {
  accessBankRegex,
  fidelityBankRegex,
  gtBankRegex,
  ubaBankRegex,
} from "../parsers";

import { stripCommas, parseSMS } from "../utils/helpers";

// Map of the banks we are working with and their corresponding regex, when this scales and more banks are added, we just add the new banks here and their corresponding regex pattern
const regexMap: { [key: string]: RegExp } = {
  AccessBank: accessBankRegex,
  FidelityBank: fidelityBankRegex,
  GTB: gtBankRegex,
  UBA: ubaBankRegex,
};

// MAIN CONTROLLER
export const parseMessage: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { parser, message, senderID } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error:
        "You did not send in a message or the message is not of type string",
    });
  }

  if (!senderID || typeof senderID !== "string") {
    return res.status(400).json({
      error:
        "You did not send in a senderID or the senderID is not of type string",
    });
  }

  const newMessage = stripCommas(message);

  const regex: any = regexMap[senderID];
  if (!regex) {
    return res.status(400).json({
      error:
        "Unsupported sender ID, supported sender Ids are AccessBank, FidelityBank, GTB and UBA",
    });
  }

  try {
    const parsedData = parseSMS(regex, newMessage);
    parsedData.institution =
      senderID.length > 4
        ? senderID.replace(/([A-Z])/g, " $1").trim()
        : senderID;
    res.status(200).json(parsedData);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Something went wrong, Please contact support" });
  }
};
