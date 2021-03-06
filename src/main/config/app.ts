import express from 'express'
import setupMiddleware from './middlewares'
import setupRoute from './router'

const app = express()
setupMiddleware(app)
setupRoute(app)

export default app
