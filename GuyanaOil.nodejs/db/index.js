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

const getArticle = async (url) => (await pool.query("SELECT title, created_on, body, thumbnail_url FROM article WHERE is_published AND seo_url = $1 LIMIT 1;", [url])).rows.map(row => {
    return {
        title: row.title,
        date: row.created_on,
        thumbnailUrl: row.thumbnail_url,
        body: row.body
    };
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    prevs: () => getArticlePreviews(),
    getArticle: (url) => getArticle(url)
}
