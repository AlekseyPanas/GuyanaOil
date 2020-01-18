const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'phantomdb.cstig7wsxqtk.us-west-2.rds.amazonaws.com',
    database: 'guyanaoil',
    password: 'gayisabsolutelynotokay',
    port: 5432,
});

const getArticlePreviews = async () => (await pool.query("SELECT title, seo_url, thumbnail_url FROM article WHERE is_published ORDER BY article_id DESC LIMIT 6;")).rows.map(row => {
    return {
        title: row.title,
        seoUrl: row.seo_url,
        thumbnailUrl: row.thumbnail_url
    };
});

const getArticle = async (url) => (await pool.query("SELECT title, created_on, body, thumbnail_url, thumbnail_caption FROM article WHERE is_published AND seo_url = $1 LIMIT 1;",
    [url])).rows.map(row => {
        return {
            title: row.title,
            date: row.created_on,
            thumbnailUrl: row.thumbnail_url,
            body: row.body,
            caption: row.thumbnail_caption
        };
    });

const saveArticle = (title, content) => {
    const toSeoUrl = (text) => text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

    if (!title || !content) {
        throw "Invalid arguments";
    }

    pool.query("INSERT INTO article (title, body, seo_url, is_published) VALUES ($1, $2, $3, true);", [title, content, toSeoUrl(title)]);
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    prevs: () => getArticlePreviews(),
    getArticle: (url) => getArticle(url),
    saveArticle: (title, content) => saveArticle(title, content)
};
