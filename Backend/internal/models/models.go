package models

import (
	"time"

	"github.com/google/uuid"
)

type CommentDTO struct {
	ID        int64         `json:"id"`
	PostID    int           `json:"post_id"`
	UserID    uuid.UUID     `json:"user_id"`
	IsChildOf *int64 `json:"is_child_of"`
	Content   string        `json:"content"`
	IsAnswer  bool `json:"is_answer"`
	CreatedAt time.Time     `json:"created_at"`
	UpdatedAt time.Time     `json:"updated_at"`
}

type CreateCommentRequest struct {
	UserID    string        `json:"user_id"`
	IsChildOf *int64 `json:"is_child_of"`
	Content   string        `json:"content"`
}

type UpdateCommentRequest struct {
	UserID    string    `json:"user_id"`
	Content   string        `json:"content"`
	IsAnswer  bool `json:"is_answer"`
}

type DeleteCommentRequest struct {
	UserID    string    `json:"user_id"`
}

type PostDTO struct {
	ID        int32     `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreatePostRequest struct {
	UserID    string    `json:"user_id"`
	Title     string    `json:"title"`
	Content      string    `json:"content"`
}

type UpdatePostRequest struct {
	UserID    string    `json:"user_id"`
	Title     string    `json:"title"`
	Content      string    `json:"content"`
}

type DeletePostRequest struct {
	UserID    string    `json:"user_id"`
}

type UserDTO struct {
	ID        uuid.UUID `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Username  string    `json:"username"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateUserRequest struct {
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Username  string    `json:"username"`
	Password  string    `json:"password"`
}

type LoginUserRequest struct {
	Email     string    `json:"email"`
	Password  string    `json:"password"`
}

type UpdateUserRequest struct {
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Username  string    `json:"username"`
	Password  string    `json:"password"`
}

