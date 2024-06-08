// // src/pages/api/suppliers/create.js

// import { suppliers } from '../../../data/suppliers'; // Adjust the path based on your data location

// export default function handler(req, res) {
//   if (req.method === 'POST') {
//     const newSupplier = req.body;
//     suppliers.push(newSupplier);
//     res.status(201).json(newSupplier);
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }
