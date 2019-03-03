function addTagsToBook(tagsString, book) {
    if(tagsString){
        let tags = tagsString.split(',');
        tags.push(book.author);
        tags.push(book.title);
        tags.push(book.publisher);
        tags.push(book.genre);
        book.tags = tags.map(t => t.toLowerCase().trim());
    }
}

function removeUnnecessaryTags(book){
    let tags = book.tags;
    tags.splice(tags.indexOf(book.author), 1);
    tags.splice(tags.indexOf(book.title), 1);
    tags.splice(tags.indexOf(book.genre), 1);
    tags.splice(tags.indexOf(book.publisher), 1);
    book.tags = tags.join(',');
}

module.exports = {
    addTagsToBook,
    removeUnnecessaryTags
}