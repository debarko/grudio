var Bookshelf = require('bookshelf').mysqlAuth;

module.exports = function() {
    var bookshelf = {};

    bookshelf.categoryModel = Bookshelf.Model.extend({
        tableName: 'category'
    });

    bookshelf.songsModel = Bookshelf.Model.extend({
        tableName: 'songs'
    });

    bookshelf.userSongsModel = Bookshelf.Model.extend({
        tableName: 'user_songs'
    })

    bookshelf.userUpvoteModel = Bookshelf.Model.extend({
        tableName: 'user_upvote'
    })

    return bookshelf;
}