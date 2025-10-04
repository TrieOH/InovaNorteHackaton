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
