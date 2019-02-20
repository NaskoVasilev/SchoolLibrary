// // const Article = require('mongoose').model('Article');
// const Edit = require('mongoose').model('Edit');
//
// module.exports = {
//     getLatestArticle: async (articleId) => {
//         let article = await Article.findById(articleId);
//         let editId = article.edits[article.edits.length-1];
//         let edit =await  Edit.findById(editId);
//         article.content = edit.content;
//         return article;
//     }
// }