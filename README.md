# Inventory Management System with MongoDB

Using MongoDB, a NoSQL database, for your inventory management system involves a different approach compared to a relational database. MongoDB stores data in a flexible, JSON-like format called BSON. Here’s a suggested schema design for an inventory management system in MongoDB.

## Collections

1. **Items**
2. **Categories**
3. **Suppliers**
4. **PurchaseOrders**
5. **InventoryTransactions**

## Sample Documents

### 1. Items

```json
{
    "_id": ObjectId("..."),
    "name": "Item Name",
    "description": "Item Description",
    "category_id": ObjectId("..."),
    "price": 100.00,
    "quantity_in_stock": 50,
    "reorder_level": 10
}
```
### 2. Categories

```json
{
    "_id": ObjectId("..."),
    "category_name": "Category Name"
}
```
### 3. Suppliers

```json
{
    "_id": ObjectId("..."),
    "supplier_name": "Supplier Name",
    "contact_name": "Contact Name",
    "address": "Supplier Address",
    "phone": "123-456-7890",
    "email": "supplier@example.com"
}
```
### 4. PurchaseOrders

```json
{
    "_id": ObjectId("..."),
    "supplier_id": ObjectId("..."),
    "order_date": ISODate("2024-06-08T00:00:00Z"),
    "status": "Pending",
    "items": [
        {
            "item_id": ObjectId("..."),
            "quantity": 10,
            "price": 50.00
        },
        {
            "item_id": ObjectId("..."),
            "quantity": 5,
            "price": 100.00
        }
    ]
}
```
### 5. InventoryTransactions

```json
{
    "_id": ObjectId("..."),
    "item_id": ObjectId("..."),
    "transaction_date": ISODate("2024-06-08T00:00:00Z"),
    "quantity": 20,
    "transaction_type": "purchase",
    "reference_id": ObjectId("...")
}
```
### Explanation
* **Items:** Stores item details, including stock levels and reorder thresholds.
* **Categories:** Stores categories for grouping items.
* **Suppliers:** Stores supplier information.
* **PurchaseOrders:** Stores purchase orders, including supplier information and items ordered.
* **InventoryTransactions:** Logs transactions that affect inventory levels, such as purchases and sales.

### Considerations

1. **Embedded vs. Referenced Data**:
    - For items in purchase orders, data is embedded for quick access and simplicity.
    - Category and supplier references are linked by `ObjectId` to allow for normalization and reduce duplication.
2. **Indexes**:
    - Create indexes on frequently queried fields such as `category_id` in the `Items` collection, `supplier_id` in the `PurchaseOrders` collection, and `item_id` in the `InventoryTransactions` collection.
3. **Atomic Operations**:
    - MongoDB supports atomic operations within a single document, which can be useful for updating inventory levels directly within the `Items` collection.

### Sample Queries

#### Insert a New Item

```javascript
db.Items.insertOne({
    "name": "New Item",
    "description": "Item Description",
    "category_id": ObjectId("..."),
    "price": 50.00,
    "quantity_in_stock": 100,
    "reorder_level": 20
});
```
#### Create a Purchase Order

```javascript
db.PurchaseOrders.insertOne({
    "supplier_id": ObjectId("..."),
    "order_date": new Date(),
    "status": "Pending",
    "items": [
        { "item_id": ObjectId("..."), "quantity": 10, "price": 50.00 },
        { "item_id": ObjectId("..."), "quantity": 5, "price": 100.00 }
    ]
});
```
#### Record an Inventory Transaction

```javascript
db.InventoryTransactions.insertOne({
    "item_id": ObjectId("..."),
    "transaction_date": new Date(),
    "quantity": 20,
    "transaction_type": "purchase",
    "reference_id": ObjectId("...")
});
```#### Query to Get All Items in a Category

```javascript
db.Items.find({ "category_id": ObjectId("...") });
```
#### Query to Get Purchase Orders by Supplier

```javascript
db.PurchaseOrders.find({ "supplier_id": ObjectId("...") });
```
