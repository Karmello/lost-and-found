use laf-dev

db.items.findOneAndUpdate(
   { '_id': ObjectId('58825f525f91b0881ac58a65') },
   { $set : { isPublic : false } }
);