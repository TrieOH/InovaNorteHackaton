-- name: VotePost :one
INSERT INTO post_votes (user_id, post_id, vote)
VALUES ($1, $2, $3)
ON CONFLICT (user_id, post_id) DO UPDATE SET vote = EXCLUDED.vote
RETURNING *;

-- name: VoteComment :one
INSERT INTO comment_votes (user_id, comment_id, vote)
VALUES ($1, $2, $3)
ON CONFLICT (user_id, comment_id) DO UPDATE SET vote = EXCLUDED.vote
RETURNING *;

-- name: GetPostKarma :one
SELECT COALESCE(SUM(vote), 0)::INT AS karma
FROM post_votes
WHERE post_id = $1;

-- name: GetCommentKarma :one
SELECT COALESCE(SUM(vote), 0)::INT AS karma
FROM comment_votes
WHERE comment_id = $1;

-- name: GetUserPostKarma :one
SELECT COALESCE(post_karma, 0)::INT AS post_karma
FROM user_post_karma
WHERE user_id = $1;

-- name: GetUserCommentKarma :one
SELECT COALESCE(comment_karma, 0)::INT AS comment_karma
FROM user_comment_karma
WHERE user_id = $1;

-- name: GetUserTotalKarma :one
SELECT COALESCE(total_karma, 0)::INT AS total_karma
FROM user_karma
WHERE user_id = $1;
