-- +goose Up

-- Votes for posts
CREATE TABLE post_votes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    vote SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

CREATE INDEX idx_post_votes_post_id ON post_votes(post_id);
CREATE INDEX idx_post_votes_user_id ON post_votes(user_id);

-- Votes for comments
CREATE TABLE comment_votes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    vote SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, comment_id)
);

CREATE INDEX idx_comment_votes_comment_id ON comment_votes(comment_id);
CREATE INDEX idx_comment_votes_user_id ON comment_votes(user_id);

-- Karma from posts
CREATE VIEW user_post_karma AS
SELECT u.id AS user_id,
       COALESCE(SUM(v.vote), 0) AS post_karma
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
LEFT JOIN post_votes v ON v.post_id = p.id
GROUP BY u.id;

-- Karma from comments
CREATE VIEW user_comment_karma AS
SELECT u.id AS user_id,
       COALESCE(SUM(v.vote), 0) AS comment_karma
FROM users u
LEFT JOIN comments c ON c.user_id = u.id
LEFT JOIN comment_votes v ON v.comment_id = c.id
GROUP BY u.id;

-- Total karma (posts + comments)
CREATE VIEW user_karma AS
SELECT u.id AS user_id,
       COALESCE(up.post_karma, 0) AS post_karma,
       COALESCE(uc.comment_karma, 0) AS comment_karma,
       COALESCE(up.post_karma, 0) + COALESCE(uc.comment_karma, 0) AS total_karma
FROM users u
LEFT JOIN user_post_karma up ON up.user_id = u.id
LEFT JOIN user_comment_karma uc ON uc.user_id = u.id;

-- +goose Down
DROP VIEW user_karma;
DROP VIEW user_post_karma;
DROP VIEW user_comment_karma;
DROP TABLE post_votes;
DROP TABLE comment_votes;
