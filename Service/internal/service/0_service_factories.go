package service

import (
	"GreetService/internal/repository"
)

type UserService struct {
	queries *repository.Queries
}

func NewUserService(queries *repository.Queries) *UserService {
	return &UserService{queries: queries}
}

type PostService struct {
	queries *repository.Queries
}

func NewPostService(queries *repository.Queries) *PostService {
	return &PostService{queries: queries}
}

type CommentService struct {
	queries *repository.Queries
}

func NewCommentService(queries *repository.Queries) *CommentService {
	return &CommentService{queries: queries}
}
