package handler

import (
	"GreetService/internal/service"
)

type UserHandler struct {
	UserService *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{UserService: service}
}

type PostHandler struct {
	PostService *service.PostService
}

func NewPostHandler(service *service.PostService) *PostHandler {
	return &PostHandler{PostService: service}
}

type CommentHandler struct {
	CommentService *service.CommentService
}

func NewCommentHandler(service *service.CommentService) *CommentHandler {
	return &CommentHandler{CommentService: service}
}

type KarmaHandler struct {
	KarmaService *service.KarmaService
}

func NewKarmaHandler(service *service.KarmaService) *KarmaHandler {
	return &KarmaHandler{KarmaService: service}
}
