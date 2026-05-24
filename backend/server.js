require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { notFoundHandler, errorHandler } = require('./middleware/error');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use('/api/auth',     require('./modules/auth/route'));
app.use('/api/hotels',   require('./modules/hotels/route'));
app.use('/api/rooms',    require('./modules/rooms/route'));
app.use('/api/bookings', require('./modules/bookings/route'));
app.use('/api/reviews',  require('./modules/reviews/route'));
app.use('/api/profile',  require('./modules/profile/route'));
app.use('/api/host',     require('./modules/host/route'));
app.use('/api/upload',   require('./modules/upload/route'));

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Nestoria API listening on :${port}`));
