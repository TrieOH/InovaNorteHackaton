-- name: CreateComment :one
INSERT INTO comments (post_id, user_id, is_child_of, content, is_answer)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, post_id, user_id, is_child_of, content, is_answer, created_at, updated_at;

-- name: GetCommentByID :one
SELECT id, post_id, user_id, is_child_of, content, is_answer, created_at, updated_at
FROM comments
WHERE id = $1;

-- name: UpdateComment :one
UPDATE comments
SET content = $2, is_answer = $3, updated_at = NOW()
WHERE id = $1
RETURNING id, post_id, user_id, is_child_of, content, is_answer, created_at, updated_at;

-- name: DeleteComment :exec
DELETE FROM comments
WHERE id = $1;

-- name: ListComments :many
SELECT id, post_id, user_id, is_child_of, content, is_answer, created_at, updated_at
FROM comments
ORDER BY created_at DESC;

-- name: ListCommentsByPost :many
SELECT id, post_id, user_id, is_child_of, content, is_answer, created_at, updated_at
FROM comments
WHERE post_id = $1
ORDER BY created_at ASC;

-- name: ListChildComments :many
SELECT id, post_id, user_id, is_child_of, content, is_answer, created_at, updated_at
FROM comments
WHERE is_child_of = $1
ORDER BY created_at ASC;

-- name: ListUserComments :many
SELECT id, post_id, user_id, is_child_of, content, is_answer, created_at, updated_at
FROM comments
WHERE user_id = $1
ORDER BY created_at ASC;
