// // src/pages/api/purchase-orders/create.js

// import { purchaseOrders } from '../../../data/purchaseOrders'; // Adjust the path based on your data location

// export default function handler(req, res) {
//   if (req.method === 'POST') {
//     const newOrder = req.body;
//     purchaseOrders.push(newOrder);
//     res.status(201).json(newOrder);
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }
