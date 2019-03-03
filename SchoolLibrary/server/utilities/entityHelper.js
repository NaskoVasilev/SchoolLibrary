const fs = require('fs');

let addBinaryFileToEntity = (req, entity) =>{
    let imagePath = req.file.path;
    entity.image = {};
    entity.image.data = fs.readFileSync(imagePath);
    entity.image.contentType = req.file.mimetype;
}

let addImageToEntity = (entity) =>{
    entity.image.data = new Buffer(entity.image.data).toString('base64');
}

let addImagesToEntities = (entities) =>{
    for (let entity of entities) {
        addImageToEntity(entity);
    }
}

let populateBookUserEntities = (entities) =>{
    for (const bookUser of entities) {
        bookUser.title = bookUser.bookId.title;
        bookUser.author = bookUser.bookId.author;
        bookUser.publisher = bookUser.bookId.publisher;
        bookUser.username = bookUser.userId.username;
        bookUser.class = bookUser.userId.class;
        bookUser.numberInClass = bookUser.userId.numberInClass;
        bookUser.date = bookUser.returnDate.toDateString();
        bookUser.userId = bookUser.userId._id;
    }
}

module.exports = {
    addBinaryFileToEntity,
    addImageToEntity,
    addImagesToEntities,
    populateBookUserEntities
}