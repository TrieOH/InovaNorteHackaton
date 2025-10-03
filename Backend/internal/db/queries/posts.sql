-- name: CreatePost :one
INSERT INTO posts (user_id, title, content)
VALUES ($1, $2, $3)
RETURNING id, user_id, title, content, created_at, updated_at;

-- name: GetPostByID :one
SELECT id, user_id, title, content, created_at, updated_at
FROM posts
WHERE id = $1;

-- name: UpdatePost :one
UPDATE posts
SET title = $2, content = $3, updated_at = NOW()
WHERE id = $1
RETURNING id, user_id, title, content, created_at, updated_at;

-- name: DeletePost :exec
DELETE FROM posts
WHERE id = $1;

-- name: ListPosts :many
SELECT id, user_id, title, content, created_at, updated_at
FROM posts
ORDER BY created_at DESC;

-- name: ListPostsByUser :many
SELECT id, user_id, title, content, created_at, updated_at
FROM posts
WHERE user_id = $1
ORDER BY created_at DESC;
