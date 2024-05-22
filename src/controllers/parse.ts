import express, { RequestHandler, Request, Response } from 'express'

export const parse_message: RequestHandler = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            message: "Success"
        })
    } catch (error) {
        return res.status(400).json({ message: "Error" })
    }

}