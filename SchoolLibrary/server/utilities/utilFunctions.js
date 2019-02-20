module.exports = {
    normaliezeImagePath: (imageUrl)=>{
        return imageUrl.substr(imageUrl.indexOf('\\'));
    }
}