//go:build !test
// +build !test

package router

import (
	"net/http"

	"GreetService/internal/handler"
	"GreetService/internal/metrics"
	"GreetService/internal/logs"
	"GreetService/internal/repository"
	"GreetService/internal/service"
	"database/sql"

	_ "GreetService/docs"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"github.com/swaggo/http-swagger"
)

// @title        Greet Service API
// @version      0.1
// @description  This is the GreetService API that handles user greetings.

// @contact.name   TrieOH Support
// @contact.url    https://github.com/TrieOH

// @host      localhost:8080
// @BasePath  /
func CreateRouter(db *sql.DB) http.Handler {
	queries := repository.New(db)
	userService := service.NewUserService(queries)
	userHandler := handler.NewUserHandler(userService)
	postService := service.NewPostService(queries)
	postHandler := handler.NewPostHandler(postService)
	commentsService := service.NewCommentService(queries)
	commentsHandler := handler.NewCommentHandler(commentsService)

	mux := http.NewServeMux()
	mux.Handle("/swagger/", httpSwagger.WrapHandler)

	mux.HandleFunc("POST /users", userHandler.CreateUser)
	mux.HandleFunc("POST /auth/login", userHandler.LoginUser)
	mux.HandleFunc("GET /users", userHandler.ListUsers)
	mux.HandleFunc("GET /users/{user_id}", userHandler.GetUserByID)
	mux.HandleFunc("PATCH /users/{user_id}", userHandler.UpdateUser)
	mux.HandleFunc("DELETE /users/{user_id}", userHandler.DeleteUser)
	mux.HandleFunc("GET /users/{user_id}/posts", postHandler.ListUserPosts)
	mux.HandleFunc("GET /users/{user_id}/comments", commentsHandler.ListUserComments)

	mux.HandleFunc("POST /posts", postHandler.CreatePost)
	mux.HandleFunc("GET /posts", postHandler.ListPosts)
	mux.HandleFunc("GET /posts/{post_id}", postHandler.GetPostByID)
	mux.HandleFunc("PATCH /posts/{post_id}", postHandler.UpdatePost)
	mux.HandleFunc("DELETE /posts/{post_id}", postHandler.DeletePost)

	mux.HandleFunc("POST /posts/{post_id}/comments", commentsHandler.CreateComment)
	mux.HandleFunc("GET /comments", commentsHandler.ListComments)
	mux.HandleFunc("GET /comments/{comment_id}", commentsHandler.GetCommentByID)
	mux.HandleFunc("GET /comments/{comment_id}/children", commentsHandler.ListChildComments)
	mux.HandleFunc("PATCH /posts/{post_id}/comments/{comment_id}", commentsHandler.UpdateComment)
	mux.HandleFunc("DELETE /posts/{post_id}/comments/{comment_id}", commentsHandler.DeleteComment)
	mux.HandleFunc("GET /posts/{post_id}/comments", commentsHandler.ListCommentsByPost)

	mux.Handle("GET /metrics", metrics.Handler())
	withMetrics := metrics.MetricsMW(mux)
	withLogging := logs.LogsMW(withMetrics)
	withID := logs.RequestIDMW(withLogging)

	withCors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Refresh"},
		AllowCredentials: true,
	}).Handler(withID)

	return withCors
}
