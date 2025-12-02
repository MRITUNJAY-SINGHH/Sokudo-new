import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import dealershipRoutes from './routes/dealershipRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import passport from './config/passport.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import testRideRoutes from "./routes/testRideroutes.js";

const PORT = process.env.PORT || 5000;

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use(passport.initialize());

// Test route
app.get('/', (req, res) => {
   res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Sokudo Backend API</title>
      <style>
        body {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: #fff;
          font-family: 'Segoe UI', Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
        }
        .container {
          background: rgba(0,0,0,0.4);
          padding: 2rem 3rem;
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          text-align: center;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          letter-spacing: 2px;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .svg-logo {
          margin-bottom: 1.5rem;
        }
        @media (max-width: 600px) {
          .container { padding: 1rem; }
          h1 { font-size: 2rem; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="svg-logo">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="#fff" stroke-width="4" fill="#2a5298"/>
            <path d="M20 50 L40 20 L60 50 Z" fill="#fff" opacity="0.9"/>
            <circle cx="40" cy="40" r="8" fill="#1e3c72"/>
          </svg>
        </div>
        <h1>Sokudo Backend API</h1>
        <p>🚀 Your API is running and ready to serve requests!</p>
      </div>
    </body>
    </html>
  `);
});

// Login/signup routes
app.use('/api/users', userRoutes);

//frontend user routes

app.use('/api/customers', customerRoutes);

//product routes
app.use('/api/products', productRoutes);

//blog routes
app.use('/api/blogs', blogRoutes);

//coupon routes
app.use('/api/coupons', couponRoutes);

//contact routes
app.use('/api/contacts', contactRoutes);

//dealership routes
app.use('/api/dealership', dealershipRoutes);

//career routes
app.use('/api/career', careerRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/transactions', transactionRoutes);

app.use('/api/inventory', inventoryRoutes);
app.use('/api/leads',leadRoutes);
app.use("/api/test-ride", testRideRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
