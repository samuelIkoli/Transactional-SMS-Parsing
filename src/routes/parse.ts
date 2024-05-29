import express from 'express'
const router = express.Router()

import { parseMessage } from '../controllers/parse'
import { parse } from 'path'

router.post('/parse', parseMessage)

module.exports = router