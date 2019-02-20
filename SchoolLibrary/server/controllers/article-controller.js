// const Article = require('mongoose').model('Article');
// const Edit = require('mongoose').model('Edit');
// const User = require('mongoose').model('User');
// const articleLoader = require('../utilities/articleLoader');
//
// module.exports = {
//     createGet: (req, res) => {
//         res.render('article/create')
//     },
//
//     createPost: async (req, res) => {
//         let article = req.body;
//         let title = article.title;
//         let content = article.content;
//
//         if (!title || !content) {
//             article.error = "Title and content are required!";
//             res.render('article/create', article)
//             return;
//         }
//
//         try {
//             let createdArticle = await Article.create({title: title})
//             let edit = await Edit.create({
//                 author: req.user._id,
//                 content: content,
//                 articleId: createdArticle._id
//             })
//
//             createdArticle.edits.push(edit._id)
//             let updatedArticle = await Article
//                 .findByIdAndUpdate({_id: createdArticle._id}, createdArticle)
//             res.redirect('/')
//
//         } catch (err) {
//             article.error = err;
//             res.render('article/create', article)
//         }
//     },
//
//     getAll: async (req, res) => {
//         let articles = await Article.find({})
//             .sort({title: 1});
//         res.render('article/all', {articles})
//     },
//
//     articleDeatils: async (req, res) => {
//         let id = req.params.id;
//         try {
//             let article = await Article.findById(id);
//             let editId = article.edits[article.edits.length - 1];
//             let edit = await Edit.findById(editId);
//             article.content = edit.content.split('\n').filter(c => c !== "");
//             res.render('article/details', article);
//         } catch (err) {
//             console.log(err)
//             res.redirect('/articles/all')
//         }
//     },
//
//     editGet: async (req, res) => {
//         let articleId = req.params.id;
//         let article = await articleLoader.getLatestArticle(articleId);
//         if (!article) {
//             return res.redirect('/');
//         }
//
//         res.render('article/edit', article)
//     },
//
//     editPost: (req, res) => {
//         let articleId = req.params.id;
//         let content = req.body.content;
//         console.log(content)
//         if (content.trim() === "" ) {
//             res.redirect('/article/edit/'+articleId)
//             return;
//         }
//
//         Edit.create({
//             author: req.user._id,
//             content: content,
//             articleId: articleId
//         }).then((edit) => {
//             Article.findById(articleId)
//                 .then(article => {
//                     article.edits.push(edit._id)
//                     Article.findByIdAndUpdate({_id: articleId}, article)
//                         .then(() => {
//                             res.redirect('/article/details/' + articleId)
//                         })
//                 }).catch(err => {
//                 res.render('article/edit', {error: err})
//                 return
//             })
//         }).catch(err => {
//             res.render('article/edit', {error: err})
//             return
//         })
//     },
//
//     getHistory: async (req, res) => {
//         let id = req.params.id;
//         let article = await Article.findById(id)
//             .populate('edits')
//         for (const edit of article.edits) {
//             edit.creator = await User.findById(edit.author)
//         }
//
//         res.render('article/history', article)
//     },
//
//     showEdit: async (req, res) => {
//         let id = req.params.id;
//         let article = {};
//         let edit = await Edit.findById(id)
//             .populate('articleId')
//         article.content = edit.content.split('\n').filter(c=>c!=="");
//         article.title = edit.articleId.title;
//         article.isLocked = edit.articleId.isLocked;
//         article._id = edit.articleId._id;
//         res.render('article/details', article);
//     },
//
//     lockArticle: async (req, res) => {
//         let id = req.params.id;
//         let article = await Article
//             .findByIdAndUpdate({_id: id}, {isLocked: true});
//         res.redirect('/article/edit/' + id);
//     },
//
//     unlockArticle: async (req, res) => {
//         let id = req.params.id;
//         let article = await Article
//             .findByIdAndUpdate({_id: id}, {isLocked: false});
//         res.redirect('/article/edit/' + id);
//     },
//
//     getLatestArticle: async (req, res) => {
//         let articles = await Article.find();
//         let latestArticle = {};
//         if (articles.length > 0) {
//             latestArticle = articles[articles.length - 1];
//             let editId = latestArticle.edits[latestArticle.edits.length - 1];
//             let edit = await Edit.findById(editId);
//             latestArticle.content = edit.content.split('\n').filter(c => c !== "");
//         }
//
//         res.render('article/details', latestArticle)
//     },
//
//     search: async (req, res) => {
//         let criteria = req.body.criteria.toLowerCase();
//         let articles = await Article.find();
//         let targetArticles = articles.filter(a => a.title.toLowerCase().includes(criteria))
//
//         res.render('article/searchResult', {articles: targetArticles, criteria: criteria})
//     }
// }