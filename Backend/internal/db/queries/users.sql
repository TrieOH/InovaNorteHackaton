-- name: CreateUser :one
INSERT INTO users (email, name, username, password)
VALUES ($1, $2, $3, $4)
RETURNING id, email, name, username, created_at, updated_at;

-- name: GetUserByID :one
SELECT id, email, name, username, password, created_at, updated_at
FROM users
WHERE id = $1;

-- name: UpdateUser :one
UPDATE users
SET email = $2, name = $3, username = $4, updated_at = NOW()
WHERE id = $1
RETURNING id, email, name, username, created_at, updated_at;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;

-- name: ListUsers :many
SELECT id, email, name, username, created_at, updated_at
FROM users
ORDER BY created_at DESC;
