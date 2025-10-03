package router

import (
	"net/http"

	"GreetService/internal/handler"
	"GreetService/internal/metrics"
	"GreetService/internal/logs"
	"GreetService/internal/repository"
	"GreetService/internal/service"
	"database/sql"

	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

func CreateTestRouter(db *sql.DB) http.Handler {
	queries := repository.New(db)
	userService := service.NewUserService(queries)
	userHandler := handler.NewUserHandler(userService)
	postService := service.NewPostService(queries)
	postHandler := handler.NewPostHandler(postService)
	commentsService := service.NewCommentService(queries)
	commentsHandler := handler.NewCommentHandler(commentsService)

	mux := http.NewServeMux()
	mux.HandleFunc("POST /users", userHandler.CreateUser)
	mux.HandleFunc("GET /users", userHandler.ListUsers)
	mux.HandleFunc("GET /users/{user_id}", userHandler.GetUserByID)
	mux.HandleFunc("PATCH /users/{user_id}", userHandler.UpdateUser)
	mux.HandleFunc("DELETE /users/{user_id}", userHandler.DeleteUser)

	mux.HandleFunc("POST /posts", postHandler.CreatePost)
	mux.HandleFunc("GET /posts", postHandler.ListPosts)
	mux.HandleFunc("GET /posts/{post_id}", postHandler.GetPostByID)
	mux.HandleFunc("PATCH /posts/{post_id}", postHandler.UpdatePost)
	mux.HandleFunc("DELETE /posts/{post_id}", postHandler.DeletePost)

	mux.HandleFunc("POST /posts/{post_id}/comments", commentsHandler.CreateComment)
	mux.HandleFunc("GET /comments", commentsHandler.ListComments)
	mux.HandleFunc("GET /comments/{comment_id}", commentsHandler.GetCommentByID)
	mux.HandleFunc("PATCH /posts/{post_id}/comments/{comment_id}", commentsHandler.UpdateComment)
	mux.HandleFunc("DELETE /posts/{post_id}/comments/{comment_id}", commentsHandler.DeleteComment)

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
